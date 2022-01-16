import { FormEvent, useEffect, useState } from 'react';
import FloorDTO from '../DTOs/FloorDTO';
import PositionDTO from '../DTOs/PositionDTO';
import { addMap } from '../services/RequestService';
import { Position } from '../types';
import './NavMap.css';

type AddMapProps = {
  setEditedPosition: Function;
  editedPosition: PositionDTO;
  setCoords: Function;
  coords: Position;
  link: string;
  positions: PositionDTO[];
  setPositions: Function;
};

const NavAddMap = ({
  setEditedPosition,
  editedPosition,
  setCoords,
  coords,
  link,
  positions,
  setPositions,
}: AddMapProps) => {
  const [floorNumber, setFloorNumber] = useState(NaN);
  const [buildingName, setBuildingName] = useState('');
  const [cabinet, setCabinet] = useState('');
  const [description, setDescription] = useState('');

  function handleFloorChange(event: FormEvent<HTMLInputElement>) {
    setFloorNumber(parseInt(event.currentTarget.value));
  }
  function handleBuildingChange(event: FormEvent<HTMLInputElement>) {
    setBuildingName(event.currentTarget.value);
  }
  function handleCabinetChange(event: FormEvent<HTMLInputElement>) {
    setCabinet(event.currentTarget.value);
  }
  function handleDescriptionChange(event: FormEvent<HTMLInputElement>) {
    setDescription(event.currentTarget.value);
  }

  function submitPosition(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPositions([...positions, editedPosition]);
    setCoords({ x: NaN, y: NaN });
    setCabinet('');
    setDescription('');
  }

  async function submitMap(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data: FloorDTO = {
      floorNumber,
      buildingName,
      imageLink: link,
      positions,
    };
    await addMap(data);
  }

  useEffect(() => {
    setEditedPosition({
      cabinet,
      description,
      x: coords?.x,
      y: coords?.y,
    });
  }, [cabinet, description, coords, setEditedPosition]);

  return (
    <div className="app-header-edit">
      <form className="floor-edit" onSubmit={submitMap}>
        <label>Этаж:</label>
        <input onChange={handleFloorChange} size={5} />
        <label>Здание:</label>
        <input onChange={handleBuildingChange} size={5} />
        <input type="submit" value="Загрузить карту" />
      </form>

      <form
        id="cabinet-form"
        className="cabinet-edit"
        onSubmit={submitPosition}
      >
        <div>
          <label htmlFor="cabinet">Кабинет:</label>
          <input id="cabinet" size={5} onChange={handleCabinetChange} />
          <label htmlFor="description">Описание</label>
          <input id="description" size={5} onChange={handleDescriptionChange} />
        </div>

        <div>
          <label htmlFor="x">X:</label>
          <input readOnly id="x" size={5} value={coords.x} />
          <label htmlFor="y">Y:</label>
          <input readOnly id="y" size={5} value={coords.y} />
          <input className="edit-button" type="submit" value="Добавить кабинет" />
        </div>
      </form>
    </div>
  );
};

export default NavAddMap;
