import { Steps } from 'antd';
import {
	Dispatch,
	memo,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { OrientationContext, t } from '../context';
import RouteSegmentDTO from '../types/RouteSegmentDTO';
import '../styles/navMap.css';

type SegmentSelectorProps = {
	route: RouteSegmentDTO[];
	setFloorNumber: Dispatch<SetStateAction<number | undefined>>;
	setBuildingName: Dispatch<SetStateAction<string | undefined>>;
	floorNumber: number | undefined;
	buildingName: string | undefined;
};

const SegmentSelector = ({
	route,
	setFloorNumber,
	setBuildingName,
	floorNumber,
	buildingName,
}: SegmentSelectorProps) => {
	const segmentFind = useCallback(() => {
		let i = -1;
		for (const seg of route) {
			if (seg.building === buildingName && seg.floor === floorNumber) {
				i++;
			}
		}

		return i + 1;
	}, [buildingName, floorNumber, route]);

	const [selectedSegment, setSelectedSegment] = useState<number>(segmentFind);
	const previousSegmentCount = useRef(0);
	const orientation = useContext(OrientationContext);

	useEffect(() => {
		if (route.length > 0 && selectedSegment > 0) {
			setFloorNumber(route[selectedSegment - 1].floor);
			setBuildingName(route[selectedSegment - 1].building);
		}
	}, [selectedSegment, route]);

	useEffect(() => {
		if (route.length !== previousSegmentCount.current) {
			previousSegmentCount.current = route.length;
			setSelectedSegment(1);
		}
	}, [route]);

	const handleFullLeft = () => {
		setSelectedSegment(1);
	};

	const handleFullRight = () => {
		setSelectedSegment(route.length);
	};

	const handleLeft = () => {
		setSelectedSegment((s) => {
			if (s > 0) {
				return s - 1;
			}
			return s;
		});
	};

	const handleRight = () => {
		setSelectedSegment((s) => {
			if (s > 0) {
				return s + 1;
			}
			return s;
		});
	};

	const handleChange = (value: number) => {
		setSelectedSegment(value + 1);
	};

	return (
		<>
			{orientation === 'landscape' ? (
				route.length > 0 && (
					<div className="segment-selector">
						<span>Этапы</span>
						<Steps
							direction="vertical"
							onChange={handleChange}
							current={selectedSegment - 1}
						>
							{route.map((seg, index) => (
								<Steps.Step
									key={index}
									title={`${t(seg.building)}, ${
										seg.floor
									}-й этаж`}
								/>
							))}
						</Steps>
					</div>
				)
			) : (
				<div className="segment-selector">
					<span>Этапы</span>{' '}
					<div className="segment-field">
						<button
							onClick={handleFullLeft}
							disabled={selectedSegment <= 1}
							children="<<"
						/>
						<button
							onClick={handleLeft}
							disabled={selectedSegment <= 1}
							children="<"
						/>
						<span className="segment">
							{selectedSegment > 0 ? selectedSegment : '·'}
						</span>
						<button
							onClick={handleRight}
							disabled={selectedSegment >= route.length}
							children=">"
						/>
						<button
							onClick={handleFullRight}
							disabled={selectedSegment >= route.length}
							children=">>"
						/>
					</div>
				</div>
			)}
		</>
	);
};
export default memo(SegmentSelector);
