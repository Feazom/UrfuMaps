import './index.css';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import Main from './routes/Main';
import AddMap from './routes/AddMap';
import React from 'react';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/add" element={<AddMap />} />
    </Routes>
  </HashRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
