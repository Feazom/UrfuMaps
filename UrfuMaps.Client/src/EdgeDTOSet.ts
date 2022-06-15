import { EdgeDTO } from './types/EdgeDTO';

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
					e.sourceId === edge.sourceId) ||
				(e.destinationId === edge.sourceId &&
					e.sourceId === edge.destinationId);
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
