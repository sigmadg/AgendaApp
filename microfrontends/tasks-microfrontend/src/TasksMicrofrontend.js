import React from 'react';
import { TasksProvider } from './context/TasksContext';
import TasksContainer from './components/TasksContainer';

const TasksMicrofrontend = () => {
  return (
    <TasksProvider>
      <TasksContainer />
    </TasksProvider>
  );
};

export default TasksMicrofrontend;
