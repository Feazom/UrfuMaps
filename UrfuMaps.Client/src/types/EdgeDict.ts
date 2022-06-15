import { Edge, keyFromString, pair } from '.';
import { EdgeDTO } from './EdgeDTO';

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
