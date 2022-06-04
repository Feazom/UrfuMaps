import { useEffect, useRef, useState } from 'react';
import NavAddMap from '../components/NavAddMap';
import MapEdit from '../components/MapEdit';
import CreatePositionDTO from '../DTOs/CreatePositionDTO';
import Konva from 'konva';
import { EdgeDTODict, PointSelected } from '../types';

const AddMap = () => {
	const [editedPosition, setEditedPosition] =
		useState<CreatePositionDTO | null>(null);
	const [link, setLink] = useState('');
	const [positions, setPositions] = useState<CreatePositionDTO[]>([]);
	const lastType = useRef<string>('');
	const edges = useRef<EdgeDTODict>(new EdgeDTODict([]));
	const [selected, setSelected] = useState<PointSelected>({ type: null });

	Konva.dragButtons = [1];

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
			<div>
				<NavAddMap
					editedPosition={editedPosition}
					setEditedPosition={setEditedPosition}
					edges={edges}
					setLink={setLink}
					link={link}
					positions={positions}
				/>
				<MapEdit
					lastType={lastType}
					setPositions={setPositions}
					setSelected={setSelected}
					selected={selected}
					edges={edges}
					link={link}
					positions={positions}
				/>
			</div>
		</div>
	);
};

export default AddMap;
