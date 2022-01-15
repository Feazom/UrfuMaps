import { useState, useEffect, FormEvent } from 'react';
import InfoDTO from '../DTOs/InfoDTO';
import env from 'react-dotenv';
import './NavMap.css';

type MapProps = {
  floor: number | null;
  setFloorNumber: Function;
  floorNumber: number;
  buildingName: string;
  setBuildingName: Function;
  searchedCabinet: string;
  setSearchedCabinet: Function;
};

const NavMap = ({
  floor,
  setFloorNumber,
  floorNumber,
  buildingName,
  setBuildingName,
  searchedCabinet,
  setSearchedCabinet,
}: MapProps) => {
  const [buildingList, setBuildingList] = useState<Record<string, number[]>>(
    {}
  );

  useEffect(() => {
    (async () => {
      const response = await fetch(`${env.API_DOMAIN}/info`, {
        method: 'GET',
      });
      const info: InfoDTO[] = await response.json();
      const buildings: Record<string, number[]> = {};
      info.forEach((e) => {
        buildings[e.buildingName] = e.floorList;
      });
      setBuildingList(buildings);
    })();
  }, []);

  function handleFloorChange(event: FormEvent<HTMLSelectElement>) {
    setFloorNumber(event.currentTarget.value);
  }

  function handleBuildingChange(event: FormEvent<HTMLSelectElement>) {
    setBuildingName(event.currentTarget.value);
  }

  function handleCabinetChange(event: FormEvent<HTMLInputElement>) {
    let cabinet = event.currentTarget.value;
    cabinet = cabinet.replace(/[rр]/i, 'r');
    cabinet = cabinet.replace(/\s+/g, '-');
    if (!isNaN(parseInt(cabinet))) {
      cabinet = 'r-' + cabinet;
    } else if (cabinet[0] === 'r' && !isNaN(parseInt(cabinet[1]))) {
      cabinet = 'r-' + cabinet.slice(1);
    }
    setSearchedCabinet(cabinet);
  }

  return (
    <div className="app-header">
      <div className="floor-select">
        <span>Floor: </span>
        <select
          value={floorNumber}
          onChange={handleFloorChange}
          onLoad={handleFloorChange}
        >
          {buildingList[buildingName]?.map((floorNumber) => {
            return <option key={floorNumber}>{floorNumber}</option>;
          })}
        </select>
      </div>
      <div className="building-select">
        <span>Building: </span>
        <select onChange={handleBuildingChange} onLoad={handleBuildingChange}>
          {Object.keys(buildingList)?.map((buildingName) => {
            return <option key={buildingName}>{buildingName}</option>;
          })}
        </select>
      </div>
      <div className="cabinet-select">
        <span>Cabinet: </span>
        <div>
          <input
            placeholder="Search..."
            onChange={handleCabinetChange}
            size={5}
          />
        </div>
      </div>
    </div>
  );
};

export default NavMap;
