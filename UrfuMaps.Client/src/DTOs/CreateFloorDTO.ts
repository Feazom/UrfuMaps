import CreatePositionDTO from './CreatePositionDTO';

type CreateFloorDTO = {
	buildingName: string;
	floorNumber: number;
	imageLink: string;
	positions: CreatePositionDTO[];
};

export default CreateFloorDTO;
