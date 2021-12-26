import { FormEvent, useState } from 'react';
import env from 'react-dotenv';
import { User } from '../types';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  function handleLoginChange(event: FormEvent<HTMLInputElement>) {
    setLogin(event.currentTarget.value);
  }

  function handlePasswordChange(event: FormEvent<HTMLInputElement>) {
    setPassword(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginFetch({ login, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <label>Login</label>
      <input
        name="login"
        placeholder="Login"
        value={login}
        onChange={handleLoginChange}
      />
      <br />

      <label>Password</label>
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <br />

      <input type="submit" />
    </form>
  );
};

export default Login;

async function loginFetch(user: User) {
  const response = await fetch(`${env.API_DOMAIN}/login`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(user),
  });
  console.log('dfs');
  // const data = await response.json();
  // console.log(data);
  // localStorage.setItem('token', data);
}
