import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ToDoList from './components/ToDoList';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <React.StrictMode>
    <ToDoList />
  </React.StrictMode>,
  document.getElementById('root')
);
