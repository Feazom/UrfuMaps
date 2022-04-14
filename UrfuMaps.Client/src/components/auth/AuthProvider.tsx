import { createContext, ReactNode, useContext, useState } from 'react';
import UserDTO from '../../DTOs/UserDTO';

type AuthContextType = {
	user: UserDTO;
	signin: (user: string) => Promise<void>;
	signout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<any>(null);

	const signin = async (newUser: string) => {
		setUser(newUser);
	};

	const signout = async () => {
		setUser(null);
	};

	const value = { user, signin, signout };

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
