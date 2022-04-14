import { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { signin } from '../services/AuthService';

const LoginPage = () => {
	const navigate = useNavigate();
	const location = useLocation() as any;
	const auth = useAuth();

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

export default LoginPage;
