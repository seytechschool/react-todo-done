import React from 'react';
import { Button, Table, Alert, InputGroup, Input, InputGroupAddon } from 'reactstrap';
import { Switch, Route } from 'react-router-dom';

import s from './ToDoList.module.scss';
import Task from './Task';
import EditTask from './EditTask';
import ToastComponent from './ToastComponent';

const testData = [
  { id: 1, title: 'Learn React', completed: true },
  { id: 2, title: 'Drink Coffee', completed: true },
  { id: 3, title: 'Debug Portal', completed: true },
  { id: 4, title: 'Run 1 Mile', completed: true },
  { id: 5, title: 'Call Parents', completed: false },
];

class ToDoList extends React.Component {
  constructor() {
    super();
    this.state = {
      tasks: testData,
      showCompleted: false,
      newTask: '',
      lastIdUsed: 1000,
      toastInfo:{showToast: false, text:'', action:''}
    };
  }

  addTask = () => {
    const { tasks, newTask, lastIdUsed } = this.state;
    // get new task id based on last used id
    const newTaskId = lastIdUsed+1;
    // create a task
    const task = { id: newTaskId, title: newTask, completed: false };
    // add into tasks
    tasks.unshift(task)
    // update state
    this.setState({ tasks, lastIdUsed:newTaskId });
    // call toast
    this.callToast(task.title, 'added')
  };

  callToast = (text, action) => {
    const toastInfo = {text, action, showToast: true}
    this.setState({toastInfo})
    setTimeout(()=>this.setState({toastInfo:{showToast:false}}), 1500)
  }

  // add a new task
  onChange = e => this.setState({ newTask: e.target.value })

  // toggle active tab
  onSelectTab = showCompleted => this.setState({ showCompleted })

  toggleStatus = (id) => {
    // get tasks
    let { tasks } = this.state;
    // find index of a task
    const ind = tasks.findIndex((item) => item.id === id);
    // toggle completed to true/false
    tasks[ind].completed = !tasks[ind].completed;
    // update state
    this.setState({ tasks });
  };

  onDelete = (task) => {
    // filter out task
    const tasks = this.state.tasks.filter(item => item.id !== task.id);
    this.setState({ tasks });
    this.callToast(task.title, 'deleted')
  };

  updateTask = (task) => {
    const { tasks } = this.state;
    const ind = tasks.findIndex(item => item.id === task.id);
    tasks[ind] = task;
    this.setState({ tasks });
    this.callToast(task.title, 'updated')
  };

  prepareTodos = () => {
    const {showCompleted, tasks} = this.state;
    let activeTodoCount = 0;
    let doneTodoCount = 0;
    const activeTabTasks = tasks.filter(item=>{
      // count doneTodo and activeTodo
      if(item.completed){
        doneTodoCount++
      } else {
        activeTodoCount++
      }
      // filter only active tab tasks
      return item.completed === showCompleted
    });
    return {activeTodoCount, doneTodoCount, activeTabTasks}
  }

  render() {
    const { showCompleted, newTask, tasks, toastInfo } = this.state;

    // get activeTodoTask, activeTodoCount, doneTodoCount
    const { activeTodoCount, doneTodoCount, activeTabTasks } = this.prepareTodos();
    console.log("tasks",tasks)
    return (
        <div className={s.toDoWrapper}>
          {/* show/hide toast */}
          { toastInfo.showToast && <ToastComponent toastInfo={toastInfo} />}
          {/* adding new task */}
          <div className={s.addToDo}>
            <InputGroup>
              <Input type="text" onChange={this.onChange} value={newTask} />
              <InputGroupAddon addonType="append">
                <Button onClick={this.addTask} primary="danger">Add Todo</Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
          {/* tabs */}
          <div className={s.tabs}>
            <Button onClick={() => this.onSelectTab(false)} color={showCompleted ? 'secondary' : 'primary'}>
              Active Todos <span>{activeTodoCount}</span>
            </Button>
            <Button onClick={() => this.onSelectTab(true)} color={showCompleted ? 'primary' : 'secondary'}>
              Done Todos <span>{doneTodoCount}</span>
            </Button>
          </div>
          {/* list of tasks */}
          <Table striped>
            <thead>
              <tr>
                <th className={s.number}>#</th>
                <th className={s.title}>Todo</th>
                <th className={s.action}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTabTasks.map((item, ind)=>{
                return (
                  <Task
                    key={item.id}
                    rowNum={ind+1}
                    task={item}
                    toggleStatus={this.toggleStatus}
                    onDelete={this.onDelete}
                  />
                )
              })}
            </tbody>
          </Table>
          { !activeTabTasks.length && <Alert color="info">No Data</Alert>}
          {/* router switches */}
          <Switch>
              <Route path="/edit/:id">
                <EditTask updateTask={this.updateTask} deleteTask={this.onDelete} tasks={tasks} />
              </Route>
            </Switch>
            {/* end of switches */}
        </div>
    );
  }
}

export default ToDoList;
