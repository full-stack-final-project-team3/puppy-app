import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './components/store/index';
import {Provider} from 'react-redux'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <App />
    </Provider>
);


