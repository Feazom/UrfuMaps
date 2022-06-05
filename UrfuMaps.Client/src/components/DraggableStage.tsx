import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { forwardRef, memo, useMemo, useRef } from 'react';
import { Stage } from 'react-konva';
import { getCenter, getDistance } from '../services/utils';

type DraggableStageProps = {
	className?: string;
	children: JSX.Element;
	width: number;
	height: number;
	dragButtons?: Array<0 | 1 | 2>;
	scaleBound?: { min: number; max: number };
};

const wheelScale = 1.2;

const DraggableStage = forwardRef<Konva.Stage, DraggableStageProps>(
	({ children, className, width, height, dragButtons, scaleBound }, ref) => {
		Konva.hitOnDragEnabled = true;
		if (dragButtons && dragButtons.length > 0) {
			Konva.dragButtons = dragButtons;
		}
		const bound = useMemo(
			() =>
				scaleBound || {
					min: 0.5,
					max: 5,
				},
			[scaleBound]
		);

		// const forceUpdate = useForceUpdate();
		// const orientation = useContext(OrientationContext);
		const lastCenter = useRef<Vector2d>();
		const lastDistance = useRef<number>();

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
				const scale =
					stage.scaleX() * (distance / lastDistance.current);

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
				direction > 0 ? oldScale * wheelScale : oldScale / wheelScale;
			const newPosition = {
				x: pointer.x - mousePointTo.x * newScale,
				y: pointer.y - mousePointTo.y * newScale,
			};
			// if (
			// 	newScale > bound.min &&
			// 	newScale < bound.max &&
			// 	stage.getSize().width - Math.abs(newPosition.x) > 20 &&
			// 	stage.getSize().height - Math.abs(newPosition.y) > 20
			// ) {
			stage.scale({ x: newScale, y: newScale });

			stage.position(newPosition);
			// }
		};

		return (
			<Stage
				ref={ref}
				className={className}
				onWheel={handleWheel}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				width={width}
				height={height}
				draggable
			>
				{children}
			</Stage>
		);
	}
);
export default memo(DraggableStage);
