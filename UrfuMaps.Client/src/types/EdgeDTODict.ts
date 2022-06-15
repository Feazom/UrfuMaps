import { keyFromString, pair } from '.';
import { EdgeDTO } from './EdgeDTO';

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
