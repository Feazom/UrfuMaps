import { FormEvent, SetStateAction, Dispatch, memo, useContext } from 'react';
import '../styles/navMap.css';
import { convertCabinet } from '../services/utils';
import RouteSegmentDTO from '../DTOs/RouteSegmentDTO';
import { OrientationContext } from '../context';

type MapProps = {
	destination: string;
	source: string;
	setDestination: Dispatch<SetStateAction<string>>;
	segmentSelector: JSX.Element;
	setSource: Dispatch<SetStateAction<string>>;
	route: RouteSegmentDTO[];
};

const NavMap = ({
	destination,
	source,
	setDestination,
	setSource,
	route,
	segmentSelector,
}: MapProps) => {
	const orientation = useContext(OrientationContext);

	const handleDestinationChange = (event: FormEvent<HTMLInputElement>) => {
		setDestination(convertCabinet(event.currentTarget.value));
	};

	const handleSourceChange = (event: FormEvent<HTMLInputElement>) => {
		setSource(convertCabinet(event.currentTarget.value));
	};

	const handlePosition = () => {};

	return (
		<div
			className={
				orientation === 'landscape'
					? 'nav-landscape nav-header'
					: 'nav-portrait nav-header'
			}
		>
			<div
				className={
					orientation === 'landscape'
						? 'cab-select-landscape'
						: 'cab-select-portrait'
				}
			>
				<span>Куда: </span>

				<div>
					<img
						onClick={handlePosition}
						className="marker-icon"
						alt="dest-marker"
						src="marker.svg"
					/>
					<input
						value={destination}
						placeholder="Поиск..."
						onChange={handleDestinationChange}
						size={5}
					/>
				</div>
			</div>
			<div
				className={
					orientation === 'landscape'
						? 'cab-select-landscape'
						: 'cab-select-portrait'
				}
			>
				<span>Откуда: </span>

				<div>
					<img
						className="marker-icon"
						src="point.svg"
						alt="src-marker"
					/>
					<input
						value={source}
						placeholder="Поиск..."
						onChange={handleSourceChange}
						size={5}
					/>
				</div>
			</div>
			{segmentSelector}
		</div>
	);
};
export default memo(NavMap);
