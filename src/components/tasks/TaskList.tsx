import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonIcon,
  IonText,
  IonButton,
  IonBadge,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  add,
} from 'ionicons/icons';
import TaskItem from './TaskItem';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority?: 'Baja' | 'Media' | 'Alta';
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onAddTask
}) => {
  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // En Ionic, usaremos un alert simple por ahora
      // En una implementación completa, usaríamos IonAlert
      const confirmDelete = window.confirm(
        `¿Estás seguro de que quieres eliminar "${task.text}"?`
      );
      if (confirmDelete) {
        onDeleteTask(taskId);
      }
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Tareas del día</span>
          <IonBadge color={completedTasks === totalTasks && totalTasks > 0 ? 'success' : 'primary'}>
            {completedTasks}/{totalTasks} completadas
          </IonBadge>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {tasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6B7280'
          }}>
            <IonIcon
              icon={checkmarkCircleOutline}
              size="large"
              style={{
                fontSize: '64px',
                marginBottom: '16px',
                opacity: 0.5
              }}
            />
            <IonText>
              <h2 style={{ margin: '0 0 8px 0', color: '#6B7280' }}>
                No hay tareas
              </h2>
              <p style={{ margin: '0 0 24px 0', color: '#9CA3AF' }}>
                Toca el botón + para agregar tu primera tarea
              </p>
            </IonText>

            <IonButton
              onClick={onAddTask}
              style={{
                '--background': '#3B82F6',
                '--border-radius': '12px'
              }}
            >
              <IonIcon icon={add} slot="start" />
              Agregar tarea
            </IonButton>
          </div>
        ) : (
          <IonList lines="none" style={{ backgroundColor: 'transparent' }}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </IonList>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TaskList;
