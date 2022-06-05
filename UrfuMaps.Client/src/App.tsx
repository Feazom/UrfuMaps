import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import AddMap from './pages/AddMapPage';
import LoginPage from './pages/LoginPage';
import Main from './pages/MainPage';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
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
		</QueryClientProvider>
	);
}

export default App;
