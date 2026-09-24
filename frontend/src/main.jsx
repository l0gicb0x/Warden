import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import SmoothScroll from '@/components/motion/SmoothScroll';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SmoothScroll>
      <App />
    </SmoothScroll>
  </StrictMode>,
);
