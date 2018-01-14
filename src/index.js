import React from 'react';
import ReactDOM from 'react-dom';
import { Web3Provider } from 'react-web3';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  <Web3Provider>
    <App />
  </Web3Provider>
), document.getElementById('root'));
registerServiceWorker();
