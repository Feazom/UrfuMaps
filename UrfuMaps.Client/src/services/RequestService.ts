import CreateFloorDTO from '../DTOs/CreateFloorDTO';
import FloorDTO from '../DTOs/FloorDTO';
import UserDTO from '../DTOs/UserDTO';
import authHeader from './AuthHeader';

const ApiUrl = 'http://localhost:5000';

export function getMap(floorNumber: number, buildingName: string) {
	return fetch(
		`${ApiUrl}/map?floor=${floorNumber}&building=${buildingName}`,
		{
			method: 'GET',
		}
	);
}

export function getRoute(sourceId: number, destinationId: number) {
	return fetch(
		`${ApiUrl}/route?source=${sourceId}&destination=${destinationId}`,
		{
			method: 'GET',
		}
	);
}

export function getTypes() {
	return fetch(`${ApiUrl}/type`, { method: 'GET' });
}

export function addMap(data: CreateFloorDTO) {
	return fetch(`${ApiUrl}/map`, {
		headers: authHeader(),
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export function checkAuth() {
	return fetch(`${ApiUrl}/user`, {
		headers: authHeader(),
		method: 'GET',
	});
}

export function login(user: UserDTO) {
	return fetch(`${ApiUrl}/login`, {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
		method: 'POST',
	});
}

export function getInfo() {
	return fetch(`${ApiUrl}/info`, {
		method: 'GET',
	});
}
