import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; 
import { Provider } from 'react-redux';
import { store } from './redux/store';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// import "admin-lte/dist/css/adminlte.min.css";
// import "admin-lte/dist/js/adminlte.min.js";



const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
     <Provider store={store}>
   <App />
 </Provider>
  </StrictMode>

);