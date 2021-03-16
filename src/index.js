import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Custom Routes
import Create from './components/create';
import Delete from './components/delete';
import Show from './components/show';

// Css files
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <div>
        <Route exact path='/' component={App} />
        <Route path='/delete/:id' component={Delete} />
        <Route path='/create' component={Create} />
        <Route path='/show/:id' component={Show} />
    </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
