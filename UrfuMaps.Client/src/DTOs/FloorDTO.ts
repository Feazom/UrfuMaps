import PositionDTO from './PositionDTO';

type FloorDTO = {
	id: string;
	buildingName: string;
	floorNumber: number;
	imageLink: string;
	positions: PositionDTO[];
};

export default FloorDTO;
