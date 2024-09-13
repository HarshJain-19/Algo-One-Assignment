import { Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById('root')).render(
  <Fragment>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </Fragment>,
)
