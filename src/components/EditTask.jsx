import React from 'react';
import { Button } from 'reactstrap';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import s from './EditTask.module.scss';

class EditTask extends React.Component {
  constructor(props) {
    super();
    this.ind = props.tasks.findIndex((item) => item.id === props.id);
    this.state = {
      originalName: props.tasks[this.ind].name,
      newName: props.tasks[this.ind].name,
    };
  }

  onChange = (e) => {
    this.setState({ newName: e.target.value });
  };

  onGoBack = () => {
    this.props.history.goBack();
  };

  onSave = () => {
    this.props.saveEdit(this.state.newName);
    this.props.history.push('/');
  };

  onCancel = () => {
    this.setState({ newName: this.state.originalName });
  };

  onDelete = () => {
    this.props.deleteTask(this.props.id);
    this.props.history.push('/');
  };

  render() {
    return (
      <div className={s.editWrapper}>
        <Button className={s.goBack} onClick={this.onGoBack} color="primary">
          go back
        </Button>
        <input onChange={(e) => this.onChange(e)} value={this.state.newName}></input>
        <div className={s.buttonWrapper}>
          <Button onClick={this.onSave} color="primary">
            Save
          </Button>

          <Button onClick={this.onCancel} color="secondary">
            Cancel
          </Button>

          <Button onClick={this.onDelete} color="danger">
            Delete
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(EditTask);
