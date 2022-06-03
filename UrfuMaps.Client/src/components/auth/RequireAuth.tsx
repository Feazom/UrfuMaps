import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/AuthService';

export function RequireAuth({ children }: { children: JSX.Element }) {
	const auth = useAuth();
	const location = useLocation();

	if (!auth) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
}
