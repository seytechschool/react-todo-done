import React from 'react';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';

import s from './ToDoList.module.scss';

function ToastComponent (props) {
  const { text, action } = props.toastInfo;
  const icon = action === 'deleted' ? 'danger' : 'primary'
  return (
      <div className={s.toast}>
        <Toast>
          <ToastHeader icon={icon}>Task Update</ToastHeader>
          <ToastBody> <strong>{text}</strong>: {action} </ToastBody>
        </Toast>
      </div>
  );
}

export default ToastComponent;
