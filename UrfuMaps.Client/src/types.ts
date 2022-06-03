import { Vector2d } from 'konva/lib/types';
import { EdgeDTO } from './DTOs/EdgeDTO';

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

export class EdgeDict {
	private readonly edges: Record<string, Edge | undefined>;

	constructor(edges: Record<string, Edge>) {
		this.edges = edges;
	}

	public add({ source, destination }: Edge) {
		if (
			source &&
			destination &&
			!this.edges[pair(source.id, destination.id)] &&
			!this.edges[pair(destination.id, source.id)]
		) {
			this.edges[pair(source.id, destination.id)] = {
				source,
				destination,
			};
		}
	}

	public remove({ sourceId, destinationId }: EdgeDTO) {
		if (this.edges[pair(sourceId, destinationId)]) {
			delete this.edges[pair(sourceId, destinationId)];
			return;
		}
		delete this.edges[pair(destinationId, sourceId)];
	}

	public get(sourceId: number, destinationId: number) {
		return (
			this.edges[pair(sourceId, destinationId)] ||
			this.edges[pair(destinationId, sourceId)]
		);
	}

	public keysString() {
		return Object.keys(this.edges);
	}

	public keys(): EdgeDTO[] {
		return Object.keys(this.edges).map((key) => {
			return keyFromString(key);
		});
	}

	[Symbol.iterator]() {
		return Object.values(this.edges);
	}
}

export function pair(first: number, second: number) {
	return `${first}-${second}`;
}

export function keyFromString(keyStr: string): EdgeDTO {
	const index = keyStr.indexOf('-');
	const sourceId = parseInt(keyStr.substring(0, index));
	const destinationId = parseInt(keyStr.substring(index + 1, keyStr.length));
	return { sourceId, destinationId };
}

export class EdgeDTODict {
	private edges: Record<string, boolean>;

	constructor(keys: string[]) {
		this.edges = {};
		for (const key of keys) {
			if (key) {
				this.edges[key] = true;
			}
		}
	}

	public add({ sourceId, destinationId }: EdgeDTO) {
		if (
			sourceId &&
			destinationId &&
			!this.edges[pair(sourceId, destinationId)] &&
			!this.edges[pair(destinationId, sourceId)]
		) {
			this.edges[pair(sourceId, destinationId)] = true;
		}
	}

	public remove({ sourceId, destinationId }: EdgeDTO) {
		if (this.edges[pair(sourceId, destinationId)]) {
			delete this.edges[pair(sourceId, destinationId)];
			return;
		}
		delete this.edges[pair(destinationId, sourceId)];
	}

	public get(sourceId: number, destinationId: number) {
		return (
			this.edges[pair(sourceId, destinationId)] ||
			this.edges[pair(destinationId, sourceId)]
		);
	}

	public keysString() {
		return Object.keys(this.edges);
	}

	public keys(): EdgeDTO[] {
		return Object.keys(this.edges).map((key) => {
			return keyFromString(key);
		});
	}
}
