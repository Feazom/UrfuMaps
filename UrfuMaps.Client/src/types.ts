import { Vector2d } from 'konva/lib/types';

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
