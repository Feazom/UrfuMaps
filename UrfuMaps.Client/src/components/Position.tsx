import {
	ChangeEvent,
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import CreatePositionDTO from '../types/CreatePositionDTO';
import CreatebleSelect from 'react-select/creatable';
import '../styles/position.css';
import { getTypes, wrapRequest } from '../services/RequestService';
import { SingleValue } from 'react-select';
import { useQuery } from 'react-query';

type PositionProps = {
	position: CreatePositionDTO | null;
	setPosition: Dispatch<SetStateAction<CreatePositionDTO | null>>;
	lastType: MutableRefObject<string>;
};

type TypeOption = {
	value: string;
	label: string;
	__isNew__?: boolean;
};

const Position = ({ position, setPosition, lastType }: PositionProps) => {
	const [types, setTypes] = useState<TypeOption[]>([]);
	const { data: typesData } = useQuery('types', () => {
		return wrapRequest(getTypes());
	});
	const [newType, setNewType] = useState<TypeOption | null>(null);

	useEffect(() => {
		if (typesData && typesData.length > 0) {
			setTypes((t) => {
				let arr = t;
				arr.push(
					...typesData.map((n) => ({
						value: n,
						label: n,
					}))
				);
				const result: TypeOption[] = [];
				new Set(arr).forEach((type) => result.push(type));
				return result;
			});
		}
	}, [typesData]);

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

	function handleTypeChange(element: SingleValue<TypeOption>) {
		if (position) {
			if (element) {
				if (element.__isNew__) {
					setNewType(element);
				}

				lastType.current = element.value;
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
		</div>
	);
};

export default Position;
