import CreateFloorDTO from '../types/CreateFloorDTO';
import FloorDTO from '../types/FloorDTO';
import InfoDTO from '../types/InfoDTO';
import PositionDTO from '../types/PositionDTO';
import RouteSegmentDTO from '../types/RouteSegmentDTO';
import TokenDTO from '../types/TokenDTO';
import UserDTO from '../types/UserDTO';
import axios, { AxiosResponse } from 'axios';
import PrefixDTO from '../types/PrefixDTO';

const user: TokenDTO | undefined = JSON.parse(localStorage.getItem('user')!);
const instance = axios.create({
	baseURL: '',
	headers: {
		Authorization: user?.token || '',
		'Content-Type': 'application/json',
	},
});

export function wrapRequest<T>(request: Promise<AxiosResponse<T, any>>) {
	return new Promise((resolve: (value: T) => void, reject) => {
		request
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function getMap(floorNumber: number, buildingName: string) {
	const params = new URLSearchParams();
	params.append('floor', floorNumber.toString());
	params.append('building', buildingName);
	return instance.get<FloorDTO>('/floor', { params });
}

export function getPosition(name: string) {
	const params = new URLSearchParams();
	params.append('name', name);
	return instance.get<PositionDTO>('/position', { params });
}

export function getRoute(sourceId: number, destinationId: number) {
	const params = new URLSearchParams();
	params.append('source', sourceId.toString());
	params.append('destination', destinationId.toString());
	return instance.get<RouteSegmentDTO[]>('/route', { params });
}

export function getTypes() {
	return instance.get<string[]>('/type');
}

export function getPrefixes() {
	return instance.get<PrefixDTO[]>('/prefix');
}

export function addMap(data: CreateFloorDTO) {
	return instance.post('/floor', data);
}

export function login(user: UserDTO) {
	return instance.post('/login', user);
}

export function getInfo() {
	return instance.get<InfoDTO[]>('/info');
}
