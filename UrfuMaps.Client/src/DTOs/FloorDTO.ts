import PositionDTO from './PositionDTO';

type FloorDTO = {
	id: number;
	buildingName: string;
	floorNumber: number;
	imageLink: string;
	positions: PositionDTO[];
};

export default FloorDTO;
