import React from 'react';
import { Button, Table } from 'reactstrap';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import s from './ToDoList.module.scss';
import Task from './Task';
import EditTask from './EditTask';

let testData = [
  { id: 1, name: 'Learn React', isActive: true },
  { id: 2, name: 'Drink Coffee', isActive: true },
  { id: 3, name: 'Debug Portal', isActive: true },
  { id: 4, name: 'Run 1 Mile', isActive: true },
  { id: 5, name: 'Call Parents', isActive: false },
];

class ToDoList extends React.Component {
  constructor() {
    super();
    this.state = {
      allTasks: [],
      displayedTasks: [],
      numberActive: null,
      numberDone: null,
      activeTab: 'active',
      newTask: '',
      lastId: 0,
      updatedTaskId: null,
    };
  }

  componentDidMount = () => {
    const allTasks = testData;
    const displayedTasks = this.getDisplayed(allTasks);
    const numberActive = displayedTasks.length;
    const numberDone = allTasks.length - numberActive;
    const lastId = allTasks.length;
    this.setState({ allTasks, displayedTasks, numberActive, numberDone, lastId });
  };

  getTaskElements = (type) => {
    const { allTasks } = this.state;
    const displayedTasks = this.getDisplayed(allTasks, type);
    if (displayedTasks.length > 0) {
      return displayedTasks.map((item, ind) => {
        let rndNumSuffix = Math.floor(Math.round * 1000 + 1000);
        return (
          <Task
            key={`${item.id}_${item.name}_${rndNumSuffix}`}
            rowNum={ind + 1}
            task={item}
            onChangeStatus={this.onChangeStatus}
            onDelete={this.onDelete}
            storeId={this.getUpdatedTaksId}
            type={type}
          />
        );
      });
    }
    return undefined;
  };

  addTask = () => {
    const { allTasks, numberActive, newTask, activeTab } = this.state;
    if (newTask.length === 0) return;
    let isUnique = true;
    allTasks.forEach((item) => {
      if (item.name === newTask) {
        isUnique = false;
      }
    });
    if (!isUnique) return;
    let lastId = this.state.lastId + 1;
    let newTaskObj = {
      id: lastId,
      name: newTask,
      isActive: true,
    };
    allTasks.push(newTaskObj);
    const displayedTasks = this.getDisplayed(allTasks, activeTab);
    this.setState({ allTasks, displayedTasks, numberActive: numberActive + 1, lastId });
  };

  onSelectTab = (tab) => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  onChangeStatus = (id, isActive) => {
    let { allTasks, activeTab } = this.state;
    const ind = allTasks.findIndex((item) => item.id === id);
    allTasks[ind].isActive = isActive;
    let displayedTasks = this.getDisplayed(allTasks, activeTab);
    let numberActive = allTasks.filter((item) => item.isActive).length;
    let numberDone = allTasks.length - numberActive;
    this.setState({ allTasks, displayedTasks, numberActive, numberDone });
  };

  onDelete = (id) => {
    let { activeTab } = this.state;
    const allTasks = this.state.allTasks.filter((item) => {
      return item.id !== id;
    });
    let numberActive = allTasks.filter((item) => item.isActive).length;
    let numberDone = allTasks.length - numberActive;
    let displayedTasks = this.getDisplayed(allTasks, activeTab);
    this.setState({ allTasks, displayedTasks, numberActive, numberDone });
  };

  saveEdit = (newName) => {
    const { updatedTaskId, allTasks } = this.state;
    let ind = allTasks.findIndex((item) => item.id === updatedTaskId);
    allTasks[ind].name = newName;
    let displayedTasks = this.getDisplayed(allTasks);
    this.setState({ allTasks, displayedTasks });
  };

  render() {
    const { activeTab, numberActive, numberDone, newTask, updatedTaskId, allTasks } = this.state;
    return (
      <Router>
        <div className={s.toDoWrapper}>
          {/* adding new task */}
          <div className={s.addToDo}>
            <input onChange={(e) => this.onChange(e)} value={newTask} type="text" />
            <Button onClick={this.addTask} color="primary">
              Add Todo
            </Button>
          </div>
          {/* tabs */}
          <div className={s.tabs}>
            <Link className={s.link} to="/">
              <Button onClick={() => this.onSelectTab('active')} color={activeTab === 'active' ? 'primary' : 'secondary'}>
                Active Todos <span>{numberActive}</span>
              </Button>
            </Link>
            <Link className={s.link} to="/done">
              <Button onClick={() => this.onSelectTab('done')} color={activeTab === 'active' ? 'secondary' : 'primary'}>
                Done Todos <span>{numberDone}</span>
              </Button>
            </Link>
          </div>
          {/* list of tasks */}
          <Table striped>
            <thead>
              <tr>
                <th className={s.number}>#</th>
                <th className={s.name}>Todo</th>
                <th className={s.action}>Actions</th>
              </tr>
            </thead>
            {/* router switches */}
            <Switch>
              <Route exact={true} path={'/'}>
                <tbody>{this.getTaskElements('active')}</tbody>
              </Route>
              <Route path="/done">
                <tbody>{this.getTaskElements('done')}</tbody>
              </Route>
              <Route path="/edit/:id">
                <tbody>{this.getTaskElements('active')}</tbody>
                <EditTask saveEdit={this.saveEdit} deleteTask={this.onDelete} id={updatedTaskId} tasks={allTasks} />
              </Route>
            </Switch>
            {/* end of switches */}
          </Table>
        </div>
      </Router>
    );
  }

  // helper functions
  getDisplayed = (allTasks, type = 'active') => {
    const isActive = type === 'active' ? true : false;
    const displayedTasks = allTasks.filter((item) => {
      return item.isActive === isActive;
    });
    return displayedTasks;
  };

  onChange(e) {
    this.setState({ newTask: e.target.value });
  }

  getUpdatedTaksId = (updatedTaskId) => {
    this.setState({ updatedTaskId });
  };
}

export default ToDoList;
