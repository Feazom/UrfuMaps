type CreatePositionDTO = {
	localId: number;
	name: string;
	description: string;
	type: string;
	x: number;
	y: number;
	relatedWith: number[];
};

export default CreatePositionDTO;
