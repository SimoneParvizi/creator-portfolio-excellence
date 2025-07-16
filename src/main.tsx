console.log('Main.tsx loading...');
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('About to render App...');
createRoot(document.getElementById("root")!).render(<App />);
console.log('App rendered.');
