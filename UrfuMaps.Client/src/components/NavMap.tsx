import {
	FormEvent,
	SetStateAction,
	Dispatch,
	memo,
	useContext,
	useRef,
	useState,
	useEffect,
	useMemo,
	ReactNode,
} from 'react';
import '../styles/navMap.css';
import { convertCabinet } from '../services/utils';
import { OrientationContext } from '../context';
import { useQuery } from 'react-query';
import { getPrefixes, wrapRequest } from '../services/RequestService';
import { Input, InputNumber, Select } from 'antd';

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
	const [sourcePrefix, setSourcePrefix] = useState('');

	const handleSourcePrefix = (value: string) => {
		setSourcePrefix(value);
	};
	const { data: prefixes } = useQuery('prefixes', () => {
		return wrapRequest(getPrefixes());
	});
	const destMarker = useMemo(
		() => (
			<img
				style={{ marginRight: '-4px' }}
				width={20}
				height={20}
				className="marker-icon"
				alt="dest-marker"
				src="marker.svg"
			/>
		),
		[]
	);
	const srcMarker = useMemo(
		() => (
			<img
				// onClick={handlePosition}
				style={{ marginLeft: '-4px' }}
				className="marker-icon"
				width={20}
				height={20}
				src="point.svg"
				alt="src-marker"
			/>
		),
		[]
	);

	useEffect(() => {
		window.clearTimeout(timeoutSrc.current);
		timeoutSrc.current = window.setTimeout(() => {
			setSource(convertCabinet(sourceInput));
		}, 300);
	}, [sourceInput]);

	useEffect(() => {
		window.clearTimeout(timeoutDst.current);
		timeoutDst.current = window.setTimeout(() => {
			setDestination(convertCabinet(destinationInput));
		}, 300);
	}, [destinationInput]);

	const handleDestinationChange = (event: FormEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		setDestinationInput(value);
	};

	const handleSourceChange = (event: FormEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		setSourceInput(value);
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
					{/* <img
						className="marker-icon"
						alt="dest-marker"
						src="marker.svg"
					/> */}
					<Input
						addonBefore={destMarker}
						value={destinationInput}
						size="small"
						onChange={handleDestinationChange}
					/>
					{/* <input
						value={destinationInput}
						placeholder="Поиск..."
						onChange={handleDestinationChange}
						size={5}
					/> */}
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
					{/* <img
						onClick={handlePosition}
						className="marker-icon"
						src="point.svg"
						alt="src-marker"
					/> */}
					<Input
						addonBefore={srcMarker}
						// addonBefore={
						// 	<Select
						// 		size="small"
						// 		style={{ width: '40px' }}
						// 		loading={!prefixes || prefixes.length === 0}
						// 		onChange={handleSourcePrefix}
						// 	>
						// 		{prefixes?.map((prefix, index) => (
						// 			<Select.Option
						// 				key={index}
						// 				value={prefix.value}
						// 			>
						// 				{prefix.value}
						// 			</Select.Option>
						// 		))}
						// 	</Select>
						// }
						value={sourceInput}
						size="small"
						onChange={handleSourceChange}
					/>
					{/* <input
						value={sourceInput}
						placeholder="Поиск..."
						onChange={handleSourceChange}
						size={5}
					/> */}
				</div>
			</div>
			{segmentSelector}
		</div>
	);
};
export default memo(NavMap);
