import { Vector2d } from 'konva/lib/types';
import { EdgeDTO } from './EdgeDTO';
import PositionDTO from './PositionDTO';

export type DebugDto = {
	fromId: number;
	fromX: number;
	fromY: number;
	toId: number;
	toX: number;
	toY: number;
};

export type TouchMoveResult = {
	scale: number;
	newPosition: Vector2d;
	lastDistance: number;
	lastCenter: Vector2d;
};

export type Point = Vector2d & {
	id: number;
};

export type PointSelected = {
	type: 'position' | 'source' | 'destination' | null;
	id?: number;
};

export type Edge = {
	source?: Point;
	destination?: Point;
};

export type Floor = {
	id: number;
	buildingName: string;
	floorNumber: number;
	imageLink: string;
	positions: Record<number, PositionDTO>;
};

export function pair(first: number, second: number) {
	return `${first}-${second}`;
}

export function keyFromString(keyStr: string): EdgeDTO {
	const index = keyStr.indexOf('-');
	const sourceId = parseInt(keyStr.substring(0, index));
	const destinationId = parseInt(keyStr.substring(index + 1, keyStr.length));
	return { sourceId, destinationId };
}
