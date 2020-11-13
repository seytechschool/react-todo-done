import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Input, InputGroupAddon } from 'reactstrap';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import s from './EditTask.module.scss';

class EditTask extends React.Component {
  constructor(props) {
    super(props);
    const {tasks, history, match:{params:{id}}} = props;
    let task = tasks.find(item => item.id === Number(id));
    // if couldn't find a task redirect to main page
    if(!task){
      history.push('/');
      task = {}
    }
    this.state = {
      task,
      newName: task.title,
      modal: true
    };
  }

  onChange = e => this.setState({ newName: e.target.value })

  onGoBack = () => {
    // close modal
    this.setState({ modal:false})
    // go back after 200ms. after animation finishes
    setTimeout(()=>this.props.history.push('/'), 200)
  };

  onSave = () => {
    const {task, newName} = this.state;
    task.title = newName;
    this.props.updateTask(task);
    this.onGoBack()
  };

  onCancel = () => {
    // update task with original
    this.setState({ newName: this.state.task.title });
    // go back
    this.onGoBack()
  };

  onDelete = () => {
    // delete a task go back
    const {task} = this.state;
    const {deleteTask} = this.props;
    deleteTask(task);
    this.onGoBack()
  };

  toggle = () => this.setState({ modal: !this.state.modal });

  render() {
    const {modal, newName} = this.state;
    return (
      <div className={s.editWrapper}>
        <Modal isOpen={modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Edit</ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input type="text" onChange={this.onChange} value={newName} />
            <InputGroupAddon addonType="append">
              <Button onClick={this.onDelete} color="danger">Delete</Button>
            </InputGroupAddon>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button className="mr-1" onClick={this.onSave} color="primary">Save</Button>
          <Button onClick={this.onCancel} color="secondary">Cancel</Button>
        </ModalFooter>
      </Modal>
      </div>
    );
  }
}

export default withRouter(EditTask);
