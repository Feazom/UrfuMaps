import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const AuthStatus = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	if (!auth.user) {
		return <p>You are not logged in.</p>;
	}

	return (
		<p>
			Welcome {auth.user}!{' '}
			<button
				onClick={async () => {
					await auth.signout();
					navigate('/');
				}}
			>
				Sign out
			</button>
		</p>
	);
};
