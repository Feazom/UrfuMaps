import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import {
	Dispatch,
	memo,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Layer, Line, Stage } from 'react-konva';
import FloorDTO from '../DTOs/FloorDTO';
import { getMap, getPosition, getRoute } from '../services/RequestService';
import URLImage from './URLImage';
import styles from '../styles/map.module.css';
import RouteSegmentDTO from '../DTOs/RouteSegmentDTO';
import { canvaPosition, getCenter, getDistance } from '../services/utils';
import { OrientationContext } from '../context';
import MarkCanvas from './MarkCanvas';
import { Point } from '../types';
import PointCanvas from './PointCanvas';

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
	Konva.hitOnDragEnabled = true;
	const scaleBy = 1.2;
	const [floor, setFloor] = useState<FloorDTO>();
	const [segment, setSegment] = useState<RouteSegmentDTO>();
	const [width, setWidth] = useState(window.innerWidth * 0.8);
	const [height, setHeight] = useState(window.innerHeight * 0.95);
	const forceUpdate = useState(false)[1];
	const timeout = useRef<NodeJS.Timeout>();
	const orientation = useContext(OrientationContext);
	const imageRef = useRef<Konva.Image>(null);
	const [destinationMarker, setDestinationMarker] = useState<Point>();
	const [sourceMarker, setSourceMarker] = useState<Point>();
	const scaleBound = {
		min: 0.5,
		max: 5,
	};
	const lastCenter = useRef<Vector2d>();
	const lastDistance = useRef<number>();

	const backgroundHeight: number = imageRef.current?.getHeight();
	const backgroundWidth: number = imageRef.current?.getWidth();
	const offset = {
		x: imageRef.current?.x() || 0,
		y: imageRef.current?.y() || 0,
	};

	useEffect(() => {
		if (orientation === 'landscape') {
			setWidth(window.innerWidth * 0.8);
			setHeight(window.innerHeight * 0.95);
		} else {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight * 0.8);
		}
		forceUpdate((v) => !v);
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
		clearTimeout(timeout.current);
		if (!source || !destination) {
			setRoute([]);
		} else {
			timeout.current = setTimeout(async () => {
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
								backgroundHeight,
								backgroundWidth,
								offset
							),
							id: sourceData.id,
						});
						setDestinationMarker({
							...canvaPosition(
								{
									x: destinationData.x,
									y: destinationData.y,
								},
								backgroundHeight,
								backgroundWidth,
								offset
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
				} catch (error) {
					// setDestinationMarker(undefined);
					// setRoute([]);
				}

				setDestinationMarker(undefined);
				setSourceMarker(undefined);
				setRoute([]);
			}, 300);
		}
	}, [source, destination]);

	function handleTouchMove(event: KonvaEventObject<TouchEvent>) {
		event.evt.preventDefault();
		const stage = event.currentTarget;
		const firstTouch = event.evt.touches[0];
		const secondTouch = event.evt.touches[1];

		if (firstTouch && secondTouch) {
			if (stage.isDragging()) {
				stage.stopDrag();
			}

			const firstPoint = {
				x: firstTouch.clientX,
				y: firstTouch.clientY,
			};
			const secondPoint = {
				x: secondTouch.clientX,
				y: secondTouch.clientY,
			};

			if (!lastCenter.current) {
				lastCenter.current = getCenter(firstPoint, secondPoint);
				return;
			}
			const newCenter = getCenter(firstPoint, secondPoint);
			const distance = getDistance(firstPoint, secondPoint);

			if (!lastDistance.current) {
				lastDistance.current = distance;
			}
			const pointTo = {
				x: (newCenter.x - stage.x()) / stage.scaleX(),
				y: (newCenter.y - stage.y()) / stage.scaleX(),
			};
			const scale = stage.scaleX() * (distance / lastDistance.current);

			stage.scaleX(scale);
			stage.scaleY(scale);

			const dx = newCenter.x - lastCenter.current.x;
			const dy = newCenter.y - lastCenter.current.y;

			const newPosition = {
				x: newCenter.x - pointTo.x * scale + dx,
				y: newCenter.y - pointTo.y * scale + dy,
			};
			stage.position(newPosition);
			lastDistance.current = distance;
			lastCenter.current = newCenter;
		}
	}

	function handleTouchEnd() {
		lastDistance.current = 0;
		lastCenter.current = undefined;
	}

	function handleWheel(event: KonvaEventObject<WheelEvent>) {
		event.evt.preventDefault();

		const stage = event.currentTarget;
		const oldScale = stage.scaleX();
		const pointer = stage.getRelativePointerPosition();

		const mousePointTo = {
			x: (pointer.x - stage.x()) / oldScale,
			y: (pointer.y - stage.y()) / oldScale,
		};

		let direction = event.evt.deltaY > 0 ? -1 : 1;

		if (event.evt.ctrlKey) {
			direction = -direction;
		}

		const newScale =
			direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
		const newPosition = {
			x: pointer.x - mousePointTo.x * newScale,
			y: pointer.y - mousePointTo.y * newScale,
		};
		if (
			newScale > scaleBound.min &&
			newScale < scaleBound.max &&
			stage.getSize().width - Math.abs(newPosition.x) > 20 &&
			stage.getSize().height - Math.abs(newPosition.y) > 20
		) {
			stage.scale({ x: newScale, y: newScale });

			stage.position(newPosition);
		}
	}

	return (
		<div className={styles.map}>
			<div className={styles.mselect}>
				{buildingSelect}
				{floorSelect}
			</div>

			<Stage
				className="map-canva"
				onWheel={handleWheel}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				width={width}
				height={height}
				draggable
			>
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
													backgroundHeight,
													backgroundWidth,
													offset
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
					{/*imageRef.current &&
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
									(position.x / 100) * backgroundWidth +
									offset.x;
								const y =
									(position.y / 100) * backgroundHeight +
									offset.y;

								return (
									<TextCanvas
										x={x}
										y={y}
										text={position.name}
										key={position.id}
									/>
								);
							})*/}
				</Layer>
			</Stage>
		</div>
	);
};
export default memo(MapCanvas);
