import PositionDTO from './PositionDTO';

type FloorDTO = {
  buildingName: string,
  floorNumber: number,
  imageLink: string,
  positions: PositionDTO[]
}

export default FloorDTO;