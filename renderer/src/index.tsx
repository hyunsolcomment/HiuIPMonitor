import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Warn from './Warn';
import './pretendard/pretendardvariable.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <HashRouter>
    <Routes>
      <Route element={<App />} path="/" />
      <Route element={<Warn />} path="/warn" />
    </Routes>
  </HashRouter>
);
