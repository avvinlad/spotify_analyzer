import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<div className="dark bg-neutral-800 text-zinc-100">
			<App />
		</div>
	</React.StrictMode>
);
