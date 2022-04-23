import UserDTO from '../DTOs/UserDTO';
import TokenDTO from '../DTOs/TokenDTO';
import { login as loginRequest } from './RequestService';

export async function signin(login: string, password: string) {
	const user: UserDTO = { login, password };
	const response = await loginRequest(user);
	let result: TokenDTO | undefined;
	if (response.ok) {
		result = await response.json();
		
		if (result?.token) {
			localStorage.setItem('user', JSON.stringify(result));
		}
	}

	return result;
}

export function logout() {
	localStorage.removeItem('user');
}

export function getCurrentUser() {
	return JSON.stringify(localStorage.getItem('user'));
}
