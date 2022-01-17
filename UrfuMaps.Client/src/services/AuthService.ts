import UserDTO from '../DTOs/UserDTO';
import TokenDTO from '../DTOs/TokenDTO';

export async function signin(login: string, password: string) {
  const user: UserDTO = { login, password };
  const response = await fetch('/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
    method: 'POST',
  });
  let result: TokenDTO | undefined;
  if (response.ok) {
    result = await response.json();
    console.log(result);
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
