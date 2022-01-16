import env from 'react-dotenv';
import FloorDTO from '../DTOs/FloorDTO';
import authHeader from './AuthHeader';

export function getMap(floorNumber: number, buildingName: string) {
  return fetch(
    `${env.API_DOMAIN}/map?floor=${floorNumber}&building=${buildingName}`,
    {
      method: 'GET',
    }
  );
}

export function addMap(data: FloorDTO) {
  return fetch(`${env.API_DOMAIN}/map`, {
    headers: authHeader(),
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function checkAuth() {
  return fetch(`${env.API_DOMAIN}/user`, {
    headers: authHeader(),
    method: 'GET',
  });
}

export function getInfo() {
  return fetch(`${env.API_DOMAIN}/info`, {
    method: 'GET',
  });
}
