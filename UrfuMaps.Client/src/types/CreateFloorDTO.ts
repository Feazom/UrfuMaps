import CreatePositionDTO from './CreatePositionDTO';
import { EdgeDTO } from './EdgeDTO';

type CreateFloorDTO = {
	buildingName: string;
	floorNumber: number;
	imageLink: string;
	positions: CreatePositionDTO[];
	edges: EdgeDTO[];
};

export default CreateFloorDTO;
