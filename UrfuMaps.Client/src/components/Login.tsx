import { FormEvent } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { signin } from '../services/AuthService';
import '../styles/login.css';

const Login = () => {
	const navigate = useNavigate();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		const login = formData.get('login')?.toString();
		const password = formData.get('password')?.toString();

		if (login && password) {
			await signin(login, password);
		}
		navigate('/add', { replace: true });
	}

	return (
		<div>
			<form onSubmit={handleSubmit} className="login-form">
				<label>Логин:</label>
				<input name="login" placeholder="Логин" size={15} />
				<label>Пароль:</label>
				<input
					type="password"
					name="password"
					placeholder="Пароль"
					size={15}
				/>
				<input type="submit" />
			</form>
		</div>
	);
};

export default Login;
