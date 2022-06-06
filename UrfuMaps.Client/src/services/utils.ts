import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { TouchMoveResult } from '../types';

const special = /[\s`~!@#$%^&*()\-_=+\[\]{};:'"\\|\/,.<>?]/g;

export function convertCabinet(cabinet: string): string {
	let result = cabinet.toLowerCase();
	result = result.replace(special, '');
	return result;
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
