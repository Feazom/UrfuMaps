import { useState, useEffect, FormEvent } from 'react';
import InfoDTO from '../DTOs/InfoDTO';
import env from 'react-dotenv';
import './NavMap.css';

type MapProps = {
    floor: number | null;
    setFloorNumber: Function;
    buildingName: string;
    setBuildingName: Function;
    searchedCabinet: string;
    setSearchedCabinet: Function;
};

const NavMap = (props: MapProps) => {
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
        props.setFloorNumber(event.currentTarget.value);
    }

    function handleBuildingChange(event: FormEvent<HTMLSelectElement>) {
        props.setBuildingName(event.currentTarget.value);
    }

    function handleCabinetChange(event: FormEvent<HTMLInputElement>) {
        props.setSearchedCabinet(event.currentTarget.value);
    }

    return (
        <div className="app-header">
            <div className="floor-select">
                <span>Floor: </span>
                <select onChange={handleFloorChange} onLoad={handleFloorChange}>
                    {buildingList[props.buildingName]?.map((floorNumber) => {
                        return <option key={floorNumber}>{floorNumber}</option>;
                    })}
                </select>
            </div>
            <div className="building-select">
                <span>Building: </span>
                <select
                    onChange={handleBuildingChange}
                    onLoad={handleBuildingChange}
                >
                    {Object.keys(buildingList)?.map((buildingName) => {
                        return (
                            <option key={buildingName}>{buildingName}</option>
                        );
                    })}
                </select>
            </div>
            <div className="cabinet-select">
                <span>Cabinet: </span>
                <div>
                    <input
                        placeholder='Search...'
                        value={props.searchedCabinet}
                        onChange={handleCabinetChange}
                        size={5}
                    />
                </div>
            </div>
        </div>
    );
};

export default NavMap;
