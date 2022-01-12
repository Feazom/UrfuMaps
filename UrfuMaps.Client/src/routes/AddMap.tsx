import { useState } from 'react';
import NavAddMap from '../components/NavAddMap';
import PositionDTO from '../DTOs/PositionDTO';
import UploadMap from '../components/UploadMap';
import { Position } from '../types';
import PositionCards from '../components/PositionCards';
import { Link } from 'react-router-dom';

const AddMap = () => {
  const [editedPosition, setEditedPosition] = useState({} as PositionDTO);
  const [coords, setCoords] = useState<Position>({ x: NaN, y: NaN });
  // const [images, setImages] = useState<ImageListType>([]);
  const [link, setLink] = useState('');
  const [positions, setPositions] = useState<PositionDTO[]>([]);

  return (
    <div className="App">
      <div className="link-add">
        <Link className="linkstyle" to="/">Home</Link>
      </div>
      {/* <Login /> */}
      <NavAddMap
        editedPosition={editedPosition}
        setEditedPosition={setEditedPosition}
        coords={coords}
        setCoords={setCoords}
        link={link}
        positions={positions}
        setPositions={setPositions}
      />
      <UploadMap setCoords={setCoords} link={link} setLink={setLink} />
      <PositionCards positions={positions} />
    </div>
  );
};

export default AddMap;
