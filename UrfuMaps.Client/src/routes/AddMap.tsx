import { useEffect, useState } from 'react';
import NavAddMap from '../components/NavAddMap';
import PositionDTO from '../DTOs/PositionDTO';
import UploadMap from '../components/UploadMap';
import { Position } from '../types';
import Login from '../components/Login';
import PositionCards from '../components/PositionCards';
import { checkAuth } from '../services/RequestService';
import { logout } from '../services/AuthService';

const AddMap = () => {
  const [editedPosition, setEditedPosition] = useState({} as PositionDTO);
  const [coords, setCoords] = useState<Position>({ x: NaN, y: NaN });
  // const [images, setImages] = useState<ImageListType>([]);
  const [link, setLink] = useState('');
  const [positions, setPositions] = useState<PositionDTO[]>([]);

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await checkAuth();
      if (response.ok) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    })();
  }, []);

  return (
    <div className="App">
      {isAuth ? (
        <div>
          <input
            className="logout-button"
            type="submit"
            onClick={() => {
              logout();
              setIsAuth(false);
            }}
            value="Выйти"
          />
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
      ) : (
        <Login setIsAuth={setIsAuth} />
      )}
    </div>
  );
};

export default AddMap;
