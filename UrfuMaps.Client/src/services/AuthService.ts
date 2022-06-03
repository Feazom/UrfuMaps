import UserDTO from '../DTOs/UserDTO';
import { login as loginRequest } from './RequestService';

export async function signin(login: string, password: string) {
	const user: UserDTO = { login, password };
	const result = await loginRequest(user);
	if (result) {
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

export function useAuth(): string | null {
	const token = localStorage.getItem('user');
	if (token) {
		return token;
	}
	return null;
}
