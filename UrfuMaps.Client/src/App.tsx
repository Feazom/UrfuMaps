import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import AddMap from './pages/AddMapPage';
import LoginPage from './pages/LoginPage';
import Main from './pages/MainPage';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route
				path="/add"
				element={
					<RequireAuth>
						<AddMap />
					</RequireAuth>
				}
			/>
			<Route path="/login" element={<LoginPage />} />
		</Routes>
	);
}

export default App;
