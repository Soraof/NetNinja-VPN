import { render } from 'preact';
import App from './App.jsx';  // ← Явное указание расширения
import './styles/globals.css';

render(<App />, document.getElementById('app'));