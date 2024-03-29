import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import CreateFloorDTO from '../types/CreateFloorDTO';
import CreatePositionDTO from '../types/CreatePositionDTO';
import { logout } from '../services/AuthService';
import { addMap } from '../services/RequestService';
import { toApiName } from '../services/utils';
import '../styles/navMap.css';
import { EdgeDTODict } from '../types/EdgeDTODict';

type AddMapProps = {
	positionElement: JSX.Element;
	link: string;
	positions: CreatePositionDTO[];
	setLink: Dispatch<SetStateAction<string>>;
	edges: React.MutableRefObject<EdgeDTODict>;
};

const NavAddMap = ({
	edges,
	positionElement,
	setLink,
	link,
	positions,
}: AddMapProps) => {
	const [floorNumber, setFloorNumber] = useState(NaN);
	const [buildingName, setBuildingName] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();
	const mutation = useMutation(addMap, { retry: false });

	useEffect(() => {
		setTimeout(() => {
			setMessage('');
		}, 10 * 1000);
	}, [message]);

	function handleFloorChange(event: FormEvent<HTMLInputElement>) {
		setFloorNumber(parseInt(event.currentTarget.value));
	}
	function handleBuildingChange(event: FormEvent<HTMLInputElement>) {
		setBuildingName(event.currentTarget.value);
	}

	function handleLinkChange(event: FormEvent<HTMLInputElement>) {
		setLink(event.currentTarget.value);
	}

	function submitMap(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const data: CreateFloorDTO = {
			floorNumber,
			buildingName,
			imageLink: link,
			positions: positions.map((p) => ({
				localId: p.localId,
				name: toApiName(p.name),
				description: p.description,
				type: p.type,
				x: p.x,
				y: p.y,
			})),
			edges: edges.current.keys(),
		};

		console.log(data);

		if (
			floorNumber &&
			buildingName &&
			link &&
			positions.length > 0 &&
			edges.current.keys().length > 0 &&
			positions.every((p) => p.type && p.localId && p.type && p.x && p.y)
		) {
			// await addMap(data);
			mutation.mutate(data);
		} else {
			setMessage(
				'все нужные поля должны быть заполнены, каждая точка должна иметь хотя бы одну связь'
			);
		}
	}

	return (
		<div
			className="app-header-edit"
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				marginTop: '5px',
			}}
		>
			<form
				className="floor-edit"
				onSubmit={submitMap}
				style={{ width: '50vw' }}
			>
				<div>
					<input
						type="submit"
						value="Загрузить карту"
						style={{ width: '200px', height: '40px' }}
					/>
					<span style={{ margin: '5px', color: 'red' }}>
						{message}
					</span>
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '130px 1fr',
						gridTemplateRows: 'repeat(3, 29px)',
						padding: '10px',
						alignItems: 'center',
					}}
				>
					<label>Номер этажа:</label>
					<input onChange={handleFloorChange} size={5} />

					<label>Здание: </label>
					<input onChange={handleBuildingChange} size={5} />

					<label>Ссылка: </label>
					<input
						style={{ width: '95%' }}
						value={link}
						onChange={handleLinkChange}
					/>
				</div>
			</form>

			{positionElement}

			<input
				className="logout-button"
				type="submit"
				onClick={() => {
					logout();
					navigate('/');
				}}
				value="Выйти"
			/>
		</div>
	);
};

export default NavAddMap;
