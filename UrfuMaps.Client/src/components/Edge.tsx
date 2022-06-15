import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import CreatePositionDTO from '../types/CreatePositionDTO';
import { PointSelected } from '../types';
import './Edge.css';

type EdgeProps = {
	setAddingEdge: Dispatch<SetStateAction<boolean>>;
	positions: CreatePositionDTO[];
	setPositions: Dispatch<SetStateAction<CreatePositionDTO[]>>;
	selected: PointSelected;
	setSelected: Dispatch<SetStateAction<PointSelected>>;
	sourceId: number | undefined;
	destinationId: number | undefined;
};

const Edge = ({
	setAddingEdge,
	selected,
	setSelected,
	sourceId,
	destinationId,
}: EdgeProps) => {
	function handleClick() {
		setAddingEdge(false);
	}

	function handleDestinationCheck(event: ChangeEvent<HTMLInputElement>) {
		const check = event.currentTarget.checked;
		setSelected({ type: check ? 'destination' : null });
	}

	function handleSourceCheck(event: ChangeEvent<HTMLInputElement>) {
		const check = event.currentTarget.checked;
		setSelected({ type: check ? 'source' : null });
	}

	return (
		<div className="edge">
			<label style={{ gridColumn: 'span 2', fontSize: '16px' }}>
				Связь:
			</label>
			<label htmlFor="sourceId">
				sourceId:{' '}
				<input
					onChange={handleSourceCheck}
					type="checkbox"
					checked={selected.type === 'source'}
				/>
			</label>
			<input
				disabled={selected.type === 'source' ? false : true}
				id="sourceId"
				size={5}
				readOnly
				value={sourceId ? sourceId : ''}
			/>
			<label htmlFor="destId">
				destId:{' '}
				<input
					onChange={handleDestinationCheck}
					type="checkbox"
					checked={selected.type === 'destination'}
				/>
			</label>
			<input
				disabled={selected.type === 'destination' ? false : true}
				id="destId"
				size={5}
				readOnly
				value={destinationId ? destinationId : ''}
			/>
			<button onClick={handleClick}>добавить</button>
		</div>
	);
};

export default Edge;
