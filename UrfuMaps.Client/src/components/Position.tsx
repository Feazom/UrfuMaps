import {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import CreatePositionDTO from '../DTOs/CreatePositionDTO';
import CreatebleSelect from 'react-select/creatable';
import './Position.css';
import { getTypes } from '../services/RequestService';
import { ActionMeta, SingleValue } from 'react-select';

type PositionProps = {
	position: CreatePositionDTO | null;
	setPosition: Dispatch<SetStateAction<CreatePositionDTO | null>>;
};

type TypeOption = {
	value: string;
	label: string;
	__isNew__?: boolean;
};

const Position = ({ position, setPosition }: PositionProps) => {
	const [types, setTypes] = useState<TypeOption[]>([]);
	const [newType, setNewType] = useState<TypeOption | null>(null);

	useEffect(() => {
		(async () => {
			const response = await getTypes();
			const types: string[] = await response.json();
			if (types.length > 0) {
				setTypes((t) => {
					let arr = t;
					arr.push(
						...types.map((n) => ({
							value: n,
							label: n,
						}))
					);
					const result: TypeOption[] = [];
					new Set(arr).forEach((type) => result.push(type));
					return result;
				});
			}
		})();
	}, []);

	useEffect(() => {
		if (newType) {
			setTypes((t) => {
				if (t.includes(newType)) {
					return t;
				}
				return [...t, newType];
			});
		}
	}, [newType]);

	function handelNameChanege(event: ChangeEvent<HTMLInputElement>) {
		if (position) {
			setPosition({
				localId: position.localId,
				type: position.type,
				name: event.currentTarget.value,
				description: position.description,
				x: position.x,
				y: position.y,
			});
		}
	}

	function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
		if (position) {
			setPosition({
				localId: position.localId,
				name: position.name,
				type: position.type,
				description: event.currentTarget.value,
				x: position.x,
				y: position.y,
			});
		}
	}

	function handleTypeChange(
		element: SingleValue<TypeOption>,
		meta: ActionMeta<TypeOption>
	) {
		if (position) {
			if (element) {
				if (element.__isNew__) {
					setNewType(element);
				}
				console.log(element.value);

				setPosition({
					localId: position.localId,
					name: position.name,
					type: element.value,
					description: position.description,
					x: position.x,
					y: position.y,
				});
			}
		}
	}

	async function loadTypes() {
		return types;
	}

	return (
		<div className="position">
			<label htmlFor="id">id</label>
			<input
				disabled={position ? false : true}
				id="id"
				size={5}
				readOnly
				value={position ? position?.localId : ''}
			/>
			<label htmlFor="name">Название:</label>
			<input
				disabled={position ? false : true}
				id="name"
				size={5}
				onChange={handelNameChanege}
				value={position ? position?.name : ''}
			/>
			<label htmlFor="description">Описание:</label>
			<input
				disabled={position ? false : true}
				id="description"
				size={5}
				onChange={handleDescriptionChange}
				value={position ? position?.description : ''}
			/>
			<label htmlFor="type">Тип:</label>
			<CreatebleSelect
				value={
					position
						? types.find((n) => n.value === position?.type)
						: undefined
				}
				className="type-select"
				options={types}
				onChange={handleTypeChange}
			/>
			{/* <label htmlFor="x">X:</label>
			<input
				disabled={position ? false : true}
				readOnly
				id="x"
				size={5}
				value={position ? position?.x : ''}
			/>
			<label htmlFor="y">Y:</label>
			<input
				disabled={position ? false : true}
				readOnly
				id="y"
				size={5}
				value={position ? position?.y : ''}
			/> */}
		</div>
	);
};

export default Position;
