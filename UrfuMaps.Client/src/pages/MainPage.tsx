import { memo, useEffect, useMemo, useState } from 'react';
import NavMap from '../components/NavMap';
import '../styles/main.css';
import MapCanvas from '../components/MapCanvas';
import Konva from 'konva';
import { getInfo } from '../services/RequestService';
import RouteSegmentDTO from '../types/RouteSegmentDTO';
import LoadingSpinner from '../components/LoadingSpinner';
import SegmentSelector from '../components/SegmentSelector';
import BuildingSelect from '../components/BuildingSelect';
import FloorSelect from '../components/FloorSelect';
import { OrientationContext } from '../context';
import { useQuery } from 'react-query';

const buildingKey = 'building';
const floorKey = 'floor';

const Main = memo(() => {
	Konva.dragButtons = [0];
	const [buildingName, setBuildingName] = useState<string>();
	const [floorNumber, setFloorNumber] = useState<number>();
	const [destination, setDestination] = useState('');
	const [source, setSource] = useState('');
	const [route, setRoute] = useState<RouteSegmentDTO[]>([]);
	const { data: buildings, isLoading } = useQuery('info', async () => {
		try {
			const { data } = await getInfo();
			if (data.length > 0) {
				const buildings: Record<string, number[]> = {};
				for (const info of data) {
					buildings[info.buildingName] = info.floorList;
				}
				return buildings;
			}
		} catch (error) {
			throw error;
		}
	});
	const [orientation, setOrientation] = useState('landscape');

	useEffect(() => {
		if (buildings && buildingName && floorNumber) {
			if (!buildings[buildingName].includes(floorNumber)) {
				setFloorNumber(1);
			}
		}
	}, [buildings, buildingName]);

	useEffect(() => {
		const type = window.screen.orientation.type;
		setOrientation(type.substring(0, type.indexOf('-')));
		window.addEventListener('orientationchange', handleOrientation);

		return () => {
			window.removeEventListener('orientationchange', handleOrientation);
		};
	}, []);

	useEffect(() => {
		if (buildingName && floorNumber) {
			localStorage.setItem(buildingKey, buildingName);
			localStorage.setItem(floorKey, floorNumber.toString());
		}
	}, [floorNumber, buildingName]);

	useEffect(() => {
		const building = localStorage.getItem(buildingKey);
		const floor = parseInt(localStorage.getItem(floorKey) || '');

		if (buildings) {
			if (building) {
				const includesBuilding =
					Object.keys(buildings).includes(building);

				if (includesBuilding) {
					setBuildingName(building);
				}

				if (
					includesBuilding &&
					!isNaN(floor) &&
					buildings[building].includes(floor)
				) {
					setFloorNumber(floor);
				} else {
					setFloorNumber(1);
				}
			} else {
				setBuildingName(Object.keys(buildings)[0]);
				setFloorNumber(1);
			}
		}
	}, [buildings]);

	const handleOrientation = () => {
		const type = window.screen.orientation.type;
		setOrientation(type.substring(0, type.indexOf('-')));
	};

	const segmentSelector = useMemo(
		() => (
			<SegmentSelector
				route={route}
				setFloorNumber={setFloorNumber}
				setBuildingName={setBuildingName}
				floorNumber={floorNumber}
				buildingName={buildingName}
			/>
		),
		[route, floorNumber, buildingName]
	);

	const buildingSelect = useMemo(
		() => (
			<BuildingSelect
				buildings={Object.keys(buildings || {})}
				buildingName={buildingName}
				setBuildingName={setBuildingName}
			/>
		),
		[buildings, buildingName]
	);
	const floorSelect = useMemo(
		() => (
			<FloorSelect
				floorNumber={floorNumber ? floorNumber : 0}
				setFloorNumber={setFloorNumber}
				floors={
					buildings && buildingName ? buildings[buildingName] : []
				}
			/>
		),
		[buildings, buildingName, floorNumber]
	);

	return (
		<OrientationContext.Provider value={orientation}>
			<div
				className={
					orientation === 'landscape'
						? 'main-landscape'
						: 'main-portrait'
				}
			>
				<NavMap
					buildingName={buildingName}
					segmentSelector={segmentSelector}
					setDestination={setDestination}
					setSource={setSource}
					destination={destination}
					source={source}
				/>
				{floorNumber && buildingName && !isLoading ? (
					<MapCanvas
						buildingSelect={buildingSelect}
						floorSelect={floorSelect}
						setRoute={setRoute}
						buildingName={buildingName}
						floorNumber={floorNumber}
						destination={destination}
						source={source}
						route={route}
					/>
				) : (
					<LoadingSpinner />
				)}
			</div>
		</OrientationContext.Provider>
	);
});

export default Main;
