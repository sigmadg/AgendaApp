import React, { createContext, useContext, useState, useEffect } from 'react';
import { TasksService } from '../services/TasksService';

const TasksContext = createContext();

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

export const TasksProvider = ({ children }) => {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tasksService = new TasksService();

  // Cargar tareas al inicializar
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const [dailyData, weeklyData] = await Promise.all([
        tasksService.getDailyTasks(),
        tasksService.getWeeklyTasks(),
      ]);
      
      setDailyTasks(dailyData);
      setWeeklyTasks(weeklyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addDailyTask = async (taskData) => {
    try {
      const newTask = await tasksService.createDailyTask(taskData);
      setDailyTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err.message);
    }
  };

  const addWeeklyTask = async (taskData) => {
    try {
      const newTask = await tasksService.createWeeklyTask(taskData);
      setWeeklyTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTask = async (taskId, type) => {
    try {
      const updatedTask = await tasksService.toggleTask(taskId, type);
      
      if (type === 'daily') {
        setDailyTasks(prev => 
          prev.map(task => task.id === taskId ? updatedTask : task)
        );
      } else {
        setWeeklyTasks(prev => 
          prev.map(task => task.id === taskId ? updatedTask : task)
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const editTask = async (taskId, updatedData) => {
    try {
      const updatedTask = await tasksService.updateTask(taskId, updatedData);
      
      setDailyTasks(prev => 
        prev.map(task => task.id === taskId ? updatedTask : task)
      );
      setWeeklyTasks(prev => 
        prev.map(task => task.id === taskId ? updatedTask : task)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId, type) => {
    try {
      await tasksService.deleteTask(taskId, type);
      
      if (type === 'daily') {
        setDailyTasks(prev => prev.filter(task => task.id !== taskId));
      } else {
        setWeeklyTasks(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addTaskNotes = async (taskId, notes) => {
    try {
      const updatedTask = await tasksService.addTaskNotes(taskId, notes);
      
      setDailyTasks(prev => 
        prev.map(task => task.id === taskId ? updatedTask : task)
      );
      setWeeklyTasks(prev => 
        prev.map(task => task.id === taskId ? updatedTask : task)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const getTaskStats = () => {
    const allTasks = [...dailyTasks, ...weeklyTasks];
    const completed = allTasks.filter(task => task.completed).length;
    const total = allTasks.length;
    const urgent = allTasks.filter(task => task.urgent).length;
    const overdue = allTasks.filter(task => task.overdue).length;

    return {
      total,
      completed,
      pending: total - completed,
      urgent,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  const getTasksByDate = (date) => {
    const targetDate = new Date(date).toISOString().split('T')[0];
    return allTasks.filter(task => task.date === targetDate);
  };

  const getTasksByPriority = (priority) => {
    return allTasks.filter(task => task.priority === priority);
  };

  const searchTasks = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return allTasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.notes?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value = {
    // State
    dailyTasks,
    weeklyTasks,
    loading,
    error,
    
    // Actions
    loadTasks,
    addDailyTask,
    addWeeklyTask,
    toggleTask,
    editTask,
    deleteTask,
    addTaskNotes,
    
    // Utilities
    getTaskStats,
    getTasksByDate,
    getTasksByPriority,
    searchTasks,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};
