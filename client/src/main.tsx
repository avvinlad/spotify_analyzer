import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Toaster } from '@/components/ui/toaster';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<div className="dark bg-neutral-900 text-neutral-50">
			<App />
			<Toaster />
		</div>
	</React.StrictMode>
);
