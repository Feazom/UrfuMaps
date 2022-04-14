import { useState } from 'react';
import NavMap from '../components/NavMap';
import '../App.css';
import MapConvas from '../components/MapConvas';
import Konva from 'konva';

function Main() {
	const [floorNumber, setFloorNumber] = useState(1);
	const [buildingName, setBuildingName] = useState('rtf');
	const [destination, setDestination] = useState('');
	const [source, setSource] = useState('');

	Konva.dragButtons = [0];

	return (
		<div className="app">
			<NavMap
				setFloorNumber={setFloorNumber}
				floorNumber={floorNumber}
				buildingName={buildingName}
				setBuildingName={setBuildingName}
				setDestination={setDestination}
				setSource={setSource}
			/>
			<MapConvas
				floorNumber={floorNumber}
				setFloorNumber={setFloorNumber}
				buildingName={buildingName}
				destination={destination}
				source={source}
			/>
			{/* <LeafletMap /> */}
		</div>
	);
}

export default Main;
