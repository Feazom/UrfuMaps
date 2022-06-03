import CreateFloorDTO from '../DTOs/CreateFloorDTO';
import FloorDTO from '../DTOs/FloorDTO';
import InfoDTO from '../DTOs/InfoDTO';
import PositionDTO from '../DTOs/PositionDTO';
import RouteSegmentDTO from '../DTOs/RouteSegmentDTO';
import TokenDTO from '../DTOs/TokenDTO';
import UserDTO from '../DTOs/UserDTO';
import authHeader from './AuthHeader';

const ApiUrl = 'http://192.168.1.102:5000';

export async function getMap(
	floorNumber: number,
	buildingName: string
): Promise<FloorDTO | undefined> {
	const mapResponse = await fetch(
		`${ApiUrl}/floor?floor=${floorNumber}&building=${buildingName}`,
		{
			method: 'GET',
		}
	);
	if (mapResponse.ok) {
		return mapResponse.json();
	}
	return undefined;
}

export async function getPosition(
	name: string
): Promise<PositionDTO | undefined> {
	const positionResponse = await fetch(`${ApiUrl}/position?name=${name}`, {
		method: 'GET',
	});
	if (positionResponse.ok) {
		return positionResponse.json();
	}
	return undefined;
}

export async function getRoute(
	sourceId: number,
	destinationId: number
): Promise<RouteSegmentDTO[]> {
	const routeResponse = await fetch(
		`${ApiUrl}/route?source=${sourceId}&destination=${destinationId}`,
		{
			method: 'GET',
		}
	);
	if (routeResponse.ok) {
		return routeResponse.json();
	}
	return [];
}

export async function getTypes(): Promise<string[]> {
	const typeResponse = await fetch(`${ApiUrl}/type`, { method: 'GET' });
	if (typeResponse.ok) {
		return typeResponse.json();
	}
	return [];
}

export async function addMap(data: CreateFloorDTO): Promise<boolean> {
	const response = await fetch(`${ApiUrl}/floor`, {
		headers: authHeader(),
		method: 'POST',
		body: JSON.stringify(data),
	});
	if (response.ok) {
		return true;
	}
	return false;
}

export async function login(user: UserDTO): Promise<TokenDTO | undefined> {
	const response = await fetch(`${ApiUrl}/login`, {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
		method: 'POST',
	});
	if (response.ok) {
		return response.json();
	}
	return undefined;
}

export async function getInfo(): Promise<InfoDTO[]> {
	const response = await fetch(`${ApiUrl}/info`, {
		method: 'GET',
	});
	if (response.ok) {
		return response.json();
	}
	return [];
}
