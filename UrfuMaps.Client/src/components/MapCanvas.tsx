import Konva from 'konva';
import {
	Dispatch,
	memo,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Line, Layer } from 'react-konva';
import FloorDTO from '../DTOs/FloorDTO';
import { getMap, getPosition, getRoute } from '../services/RequestService';
import URLImage from './URLImage';
import RouteSegmentDTO from '../DTOs/RouteSegmentDTO';
import { canvaPosition } from '../services/utils';
import { OrientationContext } from '../context';
import MarkCanvas from './MarkCanvas';
import { Point } from '../types';
import PointCanvas from './PointCanvas';
import DraggableStage from './DraggableStage';
import styles from '../styles/map.module.css';
import TextCanvas from './TextCanvas';
import { useForceUpdate } from '../hooks';

type MapProps = {
	floorNumber: number;
	route: RouteSegmentDTO[];
	setRoute: Dispatch<SetStateAction<RouteSegmentDTO[]>>;
	buildingName: string;
	destination: string;
	source: string;
	floorSelect: JSX.Element;
	buildingSelect: JSX.Element;
};

const MapCanvas = ({
	floorSelect,
	buildingSelect,
	floorNumber,
	buildingName,
	destination,
	source,
	route,
	setRoute,
}: MapProps) => {
	const [floor, setFloor] = useState<FloorDTO>();
	const [segment, setSegment] = useState<RouteSegmentDTO>();
	const [width, setWidth] = useState(window.innerWidth * 0.8);
	const [height, setHeight] = useState(window.innerHeight * 0.95);
	const forceUpdate = useForceUpdate();
	const timeout = useRef<number>();
	const orientation = useContext(OrientationContext);
	const imageRef = useRef<Konva.Image>(null);
	const [destinationMarker, setDestinationMarker] = useState<Point>();
	const [sourceMarker, setSourceMarker] = useState<Point>();

	useEffect(() => {
		if (orientation === 'landscape') {
			setWidth(window.innerWidth * 0.8);
			setHeight(window.innerHeight * 0.95);
		} else {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight * 0.8);
		}
		forceUpdate();
	}, [orientation]);

	useEffect(() => {
		setSegment(
			route.find(
				(r) =>
					r.building === floor?.buildingName &&
					r.floor === floor.floorNumber
			)
		);
	}, [route, floor]);

	useEffect(() => {
		(async () => {
			if (floorNumber != null && buildingName != null) {
				setFloor(await getMap(floorNumber, buildingName));
			}
		})();
	}, [buildingName, floorNumber]);

	useEffect(() => {
		window.clearTimeout(timeout.current);
		if (!source || !destination) {
			setRoute([]);
		} else {
			timeout.current = window.setTimeout(async () => {
				try {
					const sourceData = await getPosition(source);
					const destinationData = await getPosition(destination);

					if (sourceData && destinationData) {
						setSourceMarker({
							...canvaPosition(
								{
									x: sourceData.x,
									y: sourceData.y,
								},
								imageRef.current?.getHeight(),
								imageRef.current?.getWidth(),
								{
									x: imageRef.current?.x() || 0,
									y: imageRef.current?.y() || 0,
								}
							),
							id: sourceData.id,
						});
						setDestinationMarker({
							...canvaPosition(
								{
									x: destinationData.x,
									y: destinationData.y,
								},
								imageRef.current?.getHeight(),
								imageRef.current?.getWidth(),
								{
									x: imageRef.current?.x() || 0,
									y: imageRef.current?.y() || 0,
								}
							),
							id: destinationData.id,
						});

						const sourceId = sourceData.id;
						const destinationId = destinationData.id;

						if (sourceId && destinationId) {
							setRoute(await getRoute(sourceId, destinationId));
							return;
						}
					}
				} catch (error) {}

				setDestinationMarker(undefined);
				setSourceMarker(undefined);
				setRoute([]);
			}, 300);
		}
	}, [source, destination]);

	return (
		<div className={styles.map}>
			<div className={styles.mselect}>
				{buildingSelect}
				{floorSelect}
			</div>
			<DraggableStage width={width} height={height} imageRef={imageRef}>
				<Layer>
					{floor?.imageLink && (
						<URLImage
							ref={imageRef}
							maxWidth={width}
							maxHeight={height}
							src={floor?.imageLink}
							setUpdate={forceUpdate}
						/>
					)}
					{segment && (
						<Line
							lineJoin="round"
							lineCap="round"
							stroke="green"
							strokeWidth={4}
							points={
								segment.ids
									.flatMap((id) => {
										const position = floor?.positions.find(
											(p) => p.id == id
										);

										if (position) {
											const convertedPosition =
												canvaPosition(
													{
														x: position.x,
														y: position.y,
													},
													imageRef.current?.getHeight(),
													imageRef.current?.getWidth(),
													{
														x:
															imageRef.current?.x() ||
															0,
														y:
															imageRef.current?.y() ||
															0,
													}
												);

											return [
												convertedPosition.x,
												convertedPosition.y,
											];
										}
										return null;
									})
									.filter((n) => n) as number[]
							}
						/>
					)}

					{destinationMarker &&
						segment?.ids.includes(destinationMarker.id) && (
							<MarkCanvas
								x={destinationMarker.x}
								y={destinationMarker.y}
								color="red"
							/>
						)}
					{sourceMarker && segment?.ids.includes(sourceMarker.id) && (
						<PointCanvas x={sourceMarker.x} y={sourceMarker.y} />
					)}
					{imageRef.current &&
						floor?.positions?.map((position) => {
							const backgroundHeight =
								imageRef.current!.getHeight();
							const backgroundWidth =
								imageRef.current!.getWidth();
							const offset = {
								x: imageRef.current!.x(),
								y: imageRef.current!.y(),
							};

							const x =
								(position.x / 100) * backgroundWidth + offset.x;
							const y =
								(position.y / 100) * backgroundHeight +
								offset.y;

							return (
								<TextCanvas
									x={x}
									y={y}
									text={position.id.toString()}
									key={position.id}
								/>
							);
						})}
				</Layer>
			</DraggableStage>
		</div>
	);
};
export default memo(MapCanvas);
