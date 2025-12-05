import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('Rendering application...');

const root = ReactDOM.createRoot(rootElement);

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('Application rendered successfully');
