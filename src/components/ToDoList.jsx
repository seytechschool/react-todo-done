import React from 'react';
import { Button, Table, Alert, InputGroup, Input, InputGroupAddon, Spinner } from 'reactstrap';
import { Switch, Route } from 'react-router-dom';

import s from './ToDoList.module.scss';
import Task from './Task';
import EditTask from './EditTask';
import ToastComponent from './ToastComponent';

const JSON_API = "https://jsonplaceholder.typicode.com/todos";
class ToDoList extends React.Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
      showCompleted: false,
      newTask: '',
      lastIdUsed: 1000,
      toastInfo:{showToast: false, text:'', action:''},
      isLoading: false,
      error: ''
    };
  }

  componentDidMount() {
    const { isLoading} = this.state;
    this.setState({ isLoading: true});
      fetch(JSON_API)
      .then(res => res.json())
      .then(testData => {
        this.setState({ tasks: testData, isLoading: false })
      }).catch(error => {
        this.setState({ error: error.message, isLoading: false})
      })
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
    // if( tasks) {
      let activeTabTasks = tasks.filter(item=>{
        // count doneTodo and activeTodo
        if(item.completed){
          doneTodoCount++
        } else {
          activeTodoCount++
        }
        // filter only active tab tasks
        return item.completed === showCompleted
      });
    // }
    return {activeTodoCount, doneTodoCount, activeTabTasks}
  }

  render() {
    const { showCompleted, newTask, tasks, toastInfo, isLoading, error } = this.state;
    let { activeTodoCount, doneTodoCount, activeTabTasks } = this.prepareTodos();

    let content;

    if (isLoading) {
      content = <Spinner color="primary" />
    }
    // we can think about it.
    if (error.length > 0) {
      content =  <Alert color="info">Server error. Please try again!</Alert>;
    }

    if(tasks && tasks.length > 0) {
      content = (
        <Switch>
        <Route path="/edit/:id">
          <EditTask updateTask={this.updateTask} deleteTask={this.onDelete} tasks={tasks} />
        </Route>
      </Switch>
      )
    }

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
            {content}
            {/* end of switches */}
        </div>
    );
  }
}

export default ToDoList;
