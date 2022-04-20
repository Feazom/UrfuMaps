import { useEffect, useState } from 'react';
import NavAddMap from '../components/NavAddMap';
import MapEdit from '../components/MapEdit';
import Login from '../components/Login';
import { checkAuth } from '../services/RequestService';
import { logout } from '../services/AuthService';
import CreatePositionDTO from '../DTOs/CreatePositionDTO';
import Konva from 'konva';
import { PointSelected } from '../types';

const AddMap = () => {
	const [editedPosition, setEditedPosition] =
		useState<CreatePositionDTO | null>(null);
	const [link, setLink] = useState('');
	const [positions, setPositions] = useState<CreatePositionDTO[]>([]);
	const [selected, setSelected] = useState<PointSelected>({ type: null });
	const [isAuth, setIsAuth] = useState(false);

	Konva.dragButtons = [1];

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

	useEffect(() => {
		setPositions((elements) =>
			elements.map((p) => {
				if (p.localId === editedPosition?.localId) {
					return editedPosition;
				}
				return p;
			})
		);
	}, [editedPosition]);

	useEffect(() => {
		if (selected.type === 'position') {
			const position = positions.find((n) => n.localId === selected?.id);
			if (position) {
				setEditedPosition(position);
			}
		} else {
			setEditedPosition(null);
		}
	}, [selected, positions]);

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
						setLink={setLink}
						link={link}
						positions={positions}
						setPositions={setPositions}
						// selected={selected}
						// setSelected={setSelected}
						// sourceId={sourceId}
						// destinationId={destinationId}
					/>
					<MapEdit
						setPositions={setPositions}
						setSelected={setSelected}
						selected={selected}
						link={link}
						positions={positions}
						// setSourceId={setSourceId}
						// setDestinationId={setDestinationId}
						// sourceId={sourceId}
						// destinationId={destinationId}
					/>
				</div>
			) : (
				<Login setIsAuth={setIsAuth} />
			)}
		</div>
	);
};

export default AddMap;
