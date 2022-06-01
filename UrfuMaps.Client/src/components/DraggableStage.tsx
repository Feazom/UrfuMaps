import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { getCenter, getDistance } from '../services/utils';
import { OrientationContext } from '../context';
import styles from '../styles/map.module.css';

type DraggableStageProps = {
	children: JSX.Element;
};

const DraggableStage = ({ children }: DraggableStageProps) => {
	Konva.hitOnDragEnabled = true;
	const scaleBy = 1.2;
	const [width, setWidth] = useState(window.innerWidth * 0.8);
	const [height, setHeight] = useState(window.innerHeight * 0.95);
	const forceUpdate = useState(false)[1];
	const orientation = useContext(OrientationContext);
	const scaleBound = {
		min: 0.5,
		max: 5,
	};
	const lastCenter = useRef<Vector2d>();
	const lastDistance = useRef<number>();

	// const backgroundHeight: number = imageRef.current?.getHeight();
	// const backgroundWidth: number = imageRef.current?.getWidth();
	// const offset = {
	// 	x: imageRef.current?.x() || 0,
	// 	y: imageRef.current?.y() || 0,
	// };

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

	const handleTouchMove = (event: KonvaEventObject<TouchEvent>) => {
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
	};

	const handleTouchEnd = () => {
		lastDistance.current = 0;
		lastCenter.current = undefined;
	};

	const handleWheel = (event: KonvaEventObject<WheelEvent>) => {
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
	};

	return (
		<div className={styles.map}>
			<Stage
				className="map-canva"
				onWheel={handleWheel}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				width={width}
				height={height}
				draggable
			>
				<Layer>{children}</Layer>
			</Stage>
		</div>
	);
};
export default memo(DraggableStage);
