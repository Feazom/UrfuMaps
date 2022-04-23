import { Vector2d } from 'konva/lib/types';

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
