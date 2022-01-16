import { FormEvent, useState } from 'react';
import { signin } from '../services/AuthService';
import './Login.css';

type LoginProps = {
  setIsAuth: Function;
};

const Login = ({ setIsAuth }: LoginProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  function handleLoginChange(event: FormEvent<HTMLInputElement>) {
    setLogin(event.currentTarget.value);
  }

  function handlePasswordChange(event: FormEvent<HTMLInputElement>) {
    setPassword(event.currentTarget.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await signin(login, password);
    if (response) {
      setIsAuth(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="login">
        <label>Логин:</label>
        <input
          name="login"
          placeholder="Логин"
          size={15}
          value={login}
          onChange={handleLoginChange}
        />
      </div>
      <div className="password">
        <label>Пароль:</label>
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          size={15}
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <input type="submit" />
    </form>
  );
};

export default Login;
