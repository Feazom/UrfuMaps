import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import FloorDTO from '../DTOs/FloorDTO';
import { getMap, getRoute } from '../services/RequestService';
import URLImage from './URLImage';

type MapProps = {
	floorNumber: number;
	setFloorNumber: Dispatch<SetStateAction<number>>;
	buildingName: string | null;
	destination: string;
	source: string;
};

const MapConvas = ({
	floorNumber,
	buildingName,
	destination,
	source,
}: MapProps) => {
	const [floor, setFloor] = useState<FloorDTO>();
	const [route, setRoute] = useState<number[]>([]);
	const scaleBy = 1.2;
	const width = window.innerWidth - 50;
	const height = window.innerHeight - 120;
	const layerRef = useRef<any>();
	const scaleBound = {
		min: 0.5,
		max: 5,
	};
	let lastCenter: Vector2d | null = null;
	let lastDistance = 0;

	useEffect(() => {
		(async () => {
			if (floorNumber != null && buildingName != null) {
				const schemeResponse = await getMap(floorNumber, buildingName);

				if (schemeResponse.ok) {
					setFloor(await schemeResponse.json());
				}
			}
		})();
	}, [buildingName, floorNumber /*, destination*/]);

	// useEffect(() => {
	// 	if (source && destination && floor) {
	// 	}
	// }, [source, destination, floor]);

	useEffect(() => {
		(async () => {
			if (source && destination) {
				const sourceId = floor?.positions.find(
					(n) => n.name === source
				)?.id;
				const destinationId = floor?.positions.find(
					(n) => n.name === destination
				)?.id;

				if (sourceId && destinationId) {
					const routeResponse = await getRoute(
						sourceId,
						destinationId
					);
					setRoute(await routeResponse.json());
				} else {
					setRoute([]);
				}
			} else {
				setRoute([]);
			}
		})();
	}, [source, destination, floor]);

	function getDistance(a: Vector2d, b: Vector2d): number {
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	}

	function getCenter(a: Vector2d, b: Vector2d): Vector2d {
		return {
			x: (a.x + b.x) / 2,
			y: (a.y + b.y) / 2,
		};
	}

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

			if (!lastCenter) {
				lastCenter = getCenter(firstPoint, secondPoint);
				return;
			}
			const newCenter = getCenter(firstPoint, secondPoint);
			const distance = getDistance(firstPoint, secondPoint);

			if (!lastDistance) {
				lastDistance = distance;
			}
			const pointTo = {
				x: (newCenter.x - stage.x()) / stage.scaleX(),
				y: (newCenter.y - stage.y()) / stage.scaleX(),
			};
			const scale = stage.scaleX() * (distance / lastDistance);

			stage.scaleX(scale);
			stage.scaleY(scale);

			const dx = newCenter.x - lastCenter.x;
			const dy = newCenter.y - lastCenter.y;

			const newPosition = {
				x: newCenter.x - pointTo.x * scale + dx,
				y: newCenter.y - pointTo.y * scale + dy,
			};
			// const backgroundHeight =
			// 	backgroundRef?.current?.children?.[0]?.attrs?.image?.height;
			// const backgroundWidth =
			// 	backgroundRef?.current?.children?.[0]?.attrs?.image?.width;
			// const backgroundHeight = backgroundRef?.current?.canvas?.height;
			// const backgroundWidth = backgroundRef?.current?.canvas?.width;

			// const offset = 50;

			// if (
			// 	backgroundWidth - Math.abs(newPosition.x) > offset &&
			// 	backgroundHeight - Math.abs(newPosition.y) > offset
			// ) {
			stage.position(newPosition);
			// }
			lastDistance = distance;
			lastCenter = newCenter;
		}
	}

	function handleTouchEnd(event: KonvaEventObject<TouchEvent>) {
		lastDistance = 0;
		lastCenter = null;
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
		<Stage
			className="map-conva"
			onWheel={handleWheel}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			width={width}
			height={height}
			dragBoundFunc={(position: Vector2d): Vector2d => {
				// 		const backgroundHeight: number =
				// 	layerRef?.current?.children?.[0]?.attrs?.height;
				// const backgroundWidth: number =
				// 	layerRef?.current?.children?.[0]?.attrs?.width;

				// const offset = 70;
				const newPosition = {
					x: position.x,
					y: position.y,
				};

				// if (position.x - offset > width / 2) {
				// 	newPosition.x = width / 2 + offset;
				// }
				// if (position.y + offset > height) {
				// 	newPosition.y = height - offset;
				// }

				// if (position.x < -offset - width + backgroundWidth) {
				// 	newPosition.x = -offset - width + backgroundWidth;
				// }
				// if (position.y < offset - backgroundHeight / 2) {
				// 	newPosition.y = offset - backgroundHeight / 2;
				// }
				return newPosition;
			}}
			draggable
		>
			<Layer ref={layerRef}>
				{floor?.imageLink ? (
					<URLImage
						maxWidth={width}
						maxHeight={height}
						src={floor?.imageLink}
						x={width / 2}
						centered
					/>
				) : null}
				<Line
					points={
						route
							.flatMap((id) => {
								const position = floor?.positions.find(
									(p) => p.id == id
								);

								if (position) {
									const backgroundHeight: number =
										layerRef?.current?.children?.[0]?.attrs
											?.height;
									const backgroundWidth: number =
										layerRef?.current?.children?.[0]?.attrs
											?.width;
									const offset = {
										x: layerRef?.current?.children?.[0]
											?.attrs?.x,
										y: layerRef?.current?.children?.[0]
											?.attrs?.y,
									};

									const x =
										(position.x / 100) * backgroundWidth +
										offset.x;
									const y =
										(position.y / 100) * backgroundHeight +
										offset.y;

									return [x, y];
								}
								return null;
							})
							.filter((n) => n) as number[]
					}
					lineJoin="round"
					lineCap="round"
					stroke="red"
					strokeWidth={4}
				/>
			</Layer>
		</Stage>
	);
};

export default MapConvas;
