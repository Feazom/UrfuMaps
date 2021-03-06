// import 'antd/dist/antd.css';
import 'antd/dist/antd.min.css';
import './styles/index.css';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);

reportWebVitals();
