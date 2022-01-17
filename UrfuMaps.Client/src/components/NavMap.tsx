import { useState, useEffect, FormEvent } from 'react';
import InfoDTO from '../DTOs/InfoDTO';
import './NavMap.css';
import { getInfo } from '../services/RequestService';

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
      const response = await getInfo();
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
    cabinet = cabinet.replace(/[р]/i, 'r');
    cabinet = cabinet.replace(/\s+/g, '-');
    cabinet = cabinet.replaceAll(/[а]/gmi, 'a')
    if (!isNaN(parseInt(cabinet))) {
      cabinet = 'r-' + cabinet;
    } else if (cabinet[0] === 'r' && !isNaN(parseInt(cabinet[1]))) {
      cabinet = 'r-' + cabinet.slice(1);
    }
    setSearchedCabinet(cabinet.toLowerCase());
  }

  return (
    <div className="app-header">
      <div className="floor-select">
        <span>Этаж: </span>
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
        <span>Здание: </span>
        <select onChange={handleBuildingChange} onLoad={handleBuildingChange}>
          {Object.keys(buildingList)?.map((buildingName) => {
            return <option key={buildingName}>{buildingName}</option>;
          })}
        </select>
      </div>
      <div className="cabinet-select">
        <span>Кабинет: </span>
        <div>
          <input
            placeholder="Поиск..."
            onChange={handleCabinetChange}
            size={5}
          />
        </div>
      </div>
    </div>
  );
};

export default NavMap;
