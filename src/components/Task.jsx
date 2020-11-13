import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import s from './Task.module.scss';

function Task (props) {
  const { task:{id, completed, title}, onDelete, toggleStatus, rowNum } = props;
  // show Done/Undone based on completed property
  const doneUnDone = completed ? 'Undone' : 'Done';
  return (
    <tr>
      <th className={s.number}>{rowNum}</th>
      <td className={s.title}>{title}</td>
      <td>
        <div className={s.action}>
          <Link to={`/edit/${id}`}><Button color="primary">Edit</Button></Link>
          <Button onClick={() =>toggleStatus(id)} color="secondary">{doneUnDone}</Button>
          <Button onClick={() =>onDelete(props.task)} color="danger">Delete</Button>
        </div>
      </td>
    </tr>
  );
}

export default Task;
