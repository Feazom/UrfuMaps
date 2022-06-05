import {
	FormEvent,
	SetStateAction,
	Dispatch,
	memo,
	useContext,
	useRef,
	useState,
	useEffect,
} from 'react';
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
};

const NavMap = ({
	destination,
	source,
	setDestination,
	setSource,
	segmentSelector,
}: MapProps) => {
	const orientation = useContext(OrientationContext);
	const timeoutSrc = useRef<number>();
	const timeoutDst = useRef<number>();
	const [sourceInput, setSourceInput] = useState(source || '');
	const [destinationInput, setDestinationInput] = useState(destination || '');

	useEffect(() => {
		window.clearTimeout(timeoutSrc.current);
		timeoutSrc.current = window.setTimeout(() => {
			setSource(sourceInput);
		}, 300);
	}, [sourceInput]);

	useEffect(() => {
		window.clearTimeout(timeoutDst.current);
		timeoutDst.current = window.setTimeout(() => {
			setDestination(destinationInput);
		}, 300);
	}, [destinationInput]);

	const handleDestinationChange = (event: FormEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		setDestinationInput(convertCabinet(value));
	};

	const handleSourceChange = (event: FormEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		setSourceInput(convertCabinet(value));
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
						className="marker-icon"
						alt="dest-marker"
						src="marker.svg"
					/>
					<input
						value={destinationInput}
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
						onClick={handlePosition}
						className="marker-icon"
						src="point.svg"
						alt="src-marker"
					/>
					<input
						value={sourceInput}
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
