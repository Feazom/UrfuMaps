import { memo, useEffect, useMemo, useRef, useState } from 'react';
import NavMap from '../components/NavMap';
import '../styles/main.css';
import MapCanvas from '../components/MapCanvas';
import Konva from 'konva';
import { getInfo } from '../services/RequestService';
import RouteSegmentDTO from '../DTOs/RouteSegmentDTO';
import { Route, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import SegmentSelector from '../components/SegmentSelector';
import BuildingSelect from '../components/BuildingSelect';
import FloorSelect from '../components/FloorSelect';
import { OrientationContext } from '../context';
import { useQuery } from 'react-query';

const Main = memo(() => {
	Konva.dragButtons = [0];
	const [buildingName, setBuildingName] = useState<string>();
	const [floorNumber, setFloorNumber] = useState<number>();
	const [destination, setDestination] = useState('');
	const [source, setSource] = useState('');
	const [route, setRoute] = useState<RouteSegmentDTO[]>([]);
	// const route = useRef<RouteSegmentDTO[]>([]);
	const { data: buildings, isLoading } = useQuery('info', async () => {
		try {
			const { data } = await getInfo();
			const buildings: Record<string, number[]> = {};
			for (const info of data) {
				buildings[info.buildingName] = info.floorList;
			}
			return buildings;
		} catch (error) {
			throw error;
		}
	});
	const [queryParams] = useSearchParams();
	const [orientation, setOrientation] = useState('landscape');

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
			window.history.replaceState(
				{},
				'',
				`?building=${buildingName}&floor=${floorNumber}`
			);
		}
	}, [floorNumber, buildingName]);

	useEffect(() => {
		const building = queryParams.get('building');
		const floor = queryParams.get('floor');
		if (buildings) {
			if (building) {
				const includesBuilding =
					Object.keys(buildings).includes(building);

				if (includesBuilding) {
					setBuildingName(building);
				}

				if (
					includesBuilding &&
					floor &&
					buildings[building].includes(parseInt(floor))
				) {
					setFloorNumber(parseInt(floor));
				} else {
					setFloorNumber(1);
				}
			} else {
				setBuildingName(Object.keys(buildings)[0]);
				setFloorNumber(1);
			}
		}
	}, [buildings, queryParams]);

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
		[buildings, buildingName]
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
