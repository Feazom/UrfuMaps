// import { Edge } from './types';

// class EdgeSet {
// 	public edges: Edge[];

// 	constructor(arr: Array<Edge>) {
// 		this.edges = arr;
// 	}

// 	public add(edge: Edge) {
// 		let exists = false;
// 		if (edge && edge.destination && edge.source) {
// 			for (const e of this.edges) {
// 				exists =
// 					exists ||
// 					(e.destination!.id === edge.destination.id &&
// 						e.source!.id === edge.source.id) ||
// 					(e.destination!.id === edge.source.id &&
// 						e.source!.id === edge.destination.id);
// 				if (exists) {
// 					break;
// 				}
// 			}

// 			if (!exists) {
// 				this.edges.push(edge);
// 			}
// 		}
// 	}

// 	[Symbol.iterator]() {
// 		return this.edges.values();
// 	}
// }

// export default EdgeSet;
export {};
