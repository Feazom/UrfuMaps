import { EdgeDTO } from './DTOs/EdgeDTO';

class EdgeDTOSet {
	public edges: EdgeDTO[];

	constructor(arr: Array<EdgeDTO>) {
		this.edges = arr;
	}

	public add(edge: EdgeDTO) {
		let exists = false;
		for (const e of this.edges) {
			exists =
				exists ||
				(e.destinationId === edge.destinationId &&
					e.sourceId === edge.sourceId);
			if (exists) {
				break;
			}
		}

		if (!exists) {
			this.edges.push(edge);
		}
	}

	[Symbol.iterator]() {
		return this.edges.values();
	}
}

export default EdgeDTOSet;
