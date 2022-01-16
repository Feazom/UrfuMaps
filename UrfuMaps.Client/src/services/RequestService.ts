import FloorDTO from '../DTOs/FloorDTO';
import authHeader from './AuthHeader';

export function getMap(floorNumber: number, buildingName: string) {
  return fetch(
    `/map?floor=${floorNumber}&building=${buildingName}`,
    {
      method: 'GET',
    }
  );
}

export function addMap(data: FloorDTO) {
  return fetch('map', {
    headers: authHeader(),
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function checkAuth() {
  return fetch('/user', {
    headers: authHeader(),
    method: 'GET',
  });
}

export function getInfo() {
  return fetch('/info', {
    method: 'GET',
  });
}
