import { memo, useEffect, useMemo, useState } from 'react';
import NavMap from '../components/NavMap';
import '../styles/main.css';
import MapCanvas from '../components/MapCanvas';
import Konva from 'konva';
import { getInfo } from '../services/RequestService';
import RouteSegmentDTO from '../DTOs/RouteSegmentDTO';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import SegmentSelector from '../components/SegmentSelector';
import BuildingSelect from '../components/BuildingSelect';
import FloorSelect from '../components/FloorSelect';
import { OrientationContext } from '../context';

const Main = memo(() => {
	Konva.dragButtons = [0];
	const [buildingName, setBuildingName] = useState<string>();
	const [floorNumber, setFloorNumber] = useState<number>();
	const [destination, setDestination] = useState('');
	const [source, setSource] = useState('entry');
	const [route, setRoute] = useState<RouteSegmentDTO[]>([]);
	const [buildingList, setBuildingList] =
		useState<Record<string, number[]>>();
	const [queryParams] = useSearchParams();
	const [orientation, setOrientation] = useState('landscape');

	useEffect(() => {
		const type = window.screen.orientation.type;
		setOrientation(type.substring(0, type.indexOf('-')));
		window.addEventListener('orientationchange', handleOrientation);

		(async () => {
			const info = await getInfo();

			const buildings: Record<string, number[]> = {};
			info.forEach((e) => {
				buildings[e.buildingName] = e.floorList;
			});
			setBuildingList(buildings);
		})();

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
		if (buildingList) {
			if (building) {
				const includesBuilding =
					Object.keys(buildingList).includes(building);

				if (includesBuilding) {
					setBuildingName(building);
				}

				if (
					includesBuilding &&
					floor &&
					buildingList[building].includes(parseInt(floor))
				) {
					setFloorNumber(parseInt(floor));
				} else {
					setFloorNumber(1);
				}
			} else {
				setBuildingName(Object.keys(buildingList)[0]);
				setFloorNumber(1);
			}
		}
	}, [buildingList, queryParams]);

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
				buildingList={buildingList ? buildingList : {}}
				setBuildingName={setBuildingName}
			/>
		),
		[buildingList]
	);
	const floorSelect = useMemo(
		() => (
			<FloorSelect
				floorNumber={floorNumber ? floorNumber : 0}
				setFloorNumber={setFloorNumber}
				buildingName={buildingName ? buildingName : ''}
				buildingList={buildingList ? buildingList : {}}
			/>
		),
		[buildingList, floorNumber, buildingName]
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
					route={route}
				/>
				{floorNumber && buildingName && buildingList ? (
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
