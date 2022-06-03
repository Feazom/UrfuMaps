import { useNavigate } from 'react-router-dom';
import { logout, useAuth } from '../../services/AuthService';

export const AuthStatus = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	if (!auth) {
		return <p>You are not logged in.</p>;
	}

	return (
		<p>
			<button
				onClick={async () => {
					logout()
					navigate('/');
				}}
			>
				Sign out
			</button>
		</p>
	);
};
