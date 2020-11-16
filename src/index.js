import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import ToDoList from './components/ToDoList';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  // <React.StrictMode>
  <Router>
    <ToDoList />
  </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
);
