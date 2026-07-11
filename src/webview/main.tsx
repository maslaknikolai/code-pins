import { createRoot } from 'react-dom/client';
import { App } from './components/App';

const container = document.getElementById('root');
if (!container) {
	throw new Error('code-pins: #root element missing in webview HTML');
}
createRoot(container).render(<App />);
