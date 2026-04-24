import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

<<<<<<< HEAD
// Global error handlers for debugging white screen
window.addEventListener('error', (e) => {
  console.error('Uncaught error:', e.error, 'at', e.filename + ':' + e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

const root = createRoot(document.getElementById('root'));
root.render(<App />);

=======
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
