import { useState } from 'react';
import Map from '../components/Map';
import NavMap from '../components/NavMap';
import '../App.css';
import '../Link.css';
import { Link } from 'react-router-dom';

function Main() {
  const [floorNumber, setFloorNumber] = useState(1);
  const [buildingName, setBuildingName] = useState('rtf');
  const [searchedCabinet, setSearchedCabinet] = useState('');

  return (
    <div className="app">
      <div className="link-add">
        <Link to="/add" className="linkstyle">Add</Link>
      </div>
      <div>
        <NavMap
          floor={floorNumber}
          setFloorNumber={setFloorNumber}
          floorNumber={floorNumber}
          buildingName={buildingName}
          setBuildingName={setBuildingName}
          searchedCabinet={searchedCabinet}
          setSearchedCabinet={setSearchedCabinet}
        />
        <Map
          floorNumber={floorNumber}
          setFloorNumber={setFloorNumber}
          buildingName={buildingName}
          searchedCabinet={searchedCabinet}
        />
      </div>
    </div>
  );
}

export default Main;
