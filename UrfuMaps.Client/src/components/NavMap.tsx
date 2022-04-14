import {
	useState,
	useEffect,
	FormEvent,
	SetStateAction,
	Dispatch,
} from 'react';
import InfoDTO from '../DTOs/InfoDTO';
import './NavMap.css';
import { getInfo } from '../services/RequestService';
import { convertCabinet } from '../services/utils';

type MapProps = {
	setFloorNumber: Function;
	floorNumber: number;
	buildingName: string;
	setBuildingName: Dispatch<SetStateAction<string>>;
	setDestination: Dispatch<SetStateAction<string>>;
	setSource: Dispatch<SetStateAction<string>>;
};

const NavMap = ({
	setFloorNumber,
	floorNumber,
	buildingName,
	setBuildingName,
	setDestination,
	setSource,
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

	function handleDestinationChange(event: FormEvent<HTMLInputElement>) {
		setDestination(convertCabinet(event.currentTarget.value));
	}

	function handleSourceChange(event: FormEvent<HTMLInputElement>) {
		setSource(convertCabinet(event.currentTarget.value));
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
			<div className="src-select">
				<span>Откуда: </span>
				<div>
					<input
						placeholder="Поиск..."
						onChange={handleSourceChange}
						size={5}
					/>
				</div>
			</div>
			<div className="dest-select">
				<span>Куда: </span>
				<div>
					<input
						placeholder="Поиск..."
						onChange={handleDestinationChange}
						size={5}
					/>
				</div>
			</div>
		</div>
	);
};

export default NavMap;
