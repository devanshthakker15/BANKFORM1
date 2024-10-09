// import React from 'react';
// import ReactDOM from 'react-dom'; // Use 'react-dom/client' for React 18+
// import './index.css';
// import App from './App';


// ReactDOM.render(
//   <Provider store ={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// );




// import React from 'react';
// import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18+
// import './index.css';
// import App from './App';


// // Ensure the root element is defined
// const rootElement = document.getElementById('root') as HTMLElement; // Type assertion


// // Create a root for rendering
// const root = ReactDOM.createRoot(rootElement);


// // Render the application
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );






import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Ensure App.tsx is in the same directory
import { Provider } from 'react-redux';
// import { store } from './redux/store'; // Ensure store.ts is in the redux folder
import { store } from './redux/store';


const rootElement = document.getElementById('root') as HTMLElement;


const root = ReactDOM.createRoot(rootElement);


root.render(
 <Provider store={store}>
   <App />
 </Provider>
);