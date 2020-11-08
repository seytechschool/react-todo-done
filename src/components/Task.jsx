import React from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import s from './Task.module.scss';

class Task extends React.Component {
  constructor(props) {
    super();
    this.state = {
      id: props.task.id,
      rowNum: props.rowNum,
      name: props.task.name,
      isActive: props.task.isActive,
    };

    if (props.type === 'active') {
      this.buttons = (
        <div className={s.action}>
          <Link to={`/edit/${props.task.id}`}>
            <Button
              onClick={() => {
                props.storeId(props.task.id);
              }}
              color="primary">
              Edit
            </Button>
          </Link>
          <Button
            onClick={() => {
              props.onChangeStatus(props.task.id, false);
            }}
            color="secondary">
            Done
          </Button>
          <Button
            onClick={() => {
              props.onDelete(props.task.id);
            }}
            color="danger">
            Delete
          </Button>
        </div>
      );
    } else {
      this.buttons = (
        <div className={s.action}>
          <Button
            onClick={() => {
              props.onChangeStatus(props.task.id, true);
            }}
            color="secondary">
            Undone
          </Button>
          <Button
            onClick={() => {
              this.props.onDelete(props.task.id);
            }}
            color="danger">
            Delete
          </Button>
        </div>
      );
    }
  }

  render() {
    const { rowNum, name } = this.state;
    return (
      <tr>
        <th className={s.number}>{rowNum}</th>
        <td className={s.name}>{name}</td>
        <td>{this.buttons}</td>
      </tr>
    );
  }
}

export default withRouter(Task);
