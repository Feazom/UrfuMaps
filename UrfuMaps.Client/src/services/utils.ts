import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { TouchMoveResult } from '../types';

export function convertCabinet(cabinet: string): string {
	// let result = cabinet.toLowerCase();
	// result = result.replace(/[р]/i, 'r');
	// result = result.replace(/\s+/g, '-');
	// result = result.replaceAll(/[а]/gim, 'a');
	// result = result.replaceAll(/[б]/gim, 'b');
	// if (!isNaN(parseInt(result))) {
	// 	result = 'r-' + result;
	// } else if (result[0] === 'r' && !isNaN(parseInt(result[1]))) {
	// 	result = 'r-' + result.slice(1);
	// }
	// return result;
	return cabinet;
}

export function touchMove(
	event: KonvaEventObject<TouchEvent>,
	lastCenter: Vector2d | undefined,
	lastDistance: number | undefined
): TouchMoveResult | undefined {
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

		// stage.scaleX(scale);
		// stage.scaleY(scale);

		const dx = newCenter.x - lastCenter.x;
		const dy = newCenter.y - lastCenter.y;

		const newPosition = {
			x: newCenter.x - pointTo.x * scale + dx,
			y: newCenter.y - pointTo.y * scale + dy,
		};
		return {
			scale,
			newPosition,
			lastDistance: distance,
			lastCenter: newCenter,
		};
	}
}

export function getDistance(a: Vector2d, b: Vector2d): number {
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function getCenter(a: Vector2d, b: Vector2d): Vector2d {
	return {
		x: (a.x + b.x) / 2,
		y: (a.y + b.y) / 2,
	};
}

export function clone<T>(origin: T): T {
	return Object.assign(Object.create(Object.getPrototypeOf(origin)), origin);
}

export function apiPosition(
	position: Vector2d,
	height: number,
	width: number,
	offset: Vector2d
) {
	return {
		x: ((position.x - offset.x) / width) * 100,
		y: ((position.y - offset.y) / height) * 100,
	};
}

export function canvaPosition(
	position: Vector2d,
	height: number,
	widtgh: number,
	offset: Vector2d
) {
	return {
		x: (position.x / 100) * widtgh + offset.x,
		y: (position.y / 100) * height + offset.y,
	};
}
