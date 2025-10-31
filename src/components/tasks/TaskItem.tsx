import React from 'react';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
  IonText,
  IonChip,
} from '@ionic/react';
import {
  trash,
  checkmark,
} from 'ionicons/icons';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority?: 'Baja' | 'Media' | 'Alta';
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Alta': return 'danger';
      case 'Media': return 'warning';
      case 'Baja': return 'success';
      default: return 'primary';
    }
  };

  return (
    <IonItem
      style={{
        '--border-radius': '12px',
        '--inner-padding-end': '8px',
        '--inner-padding-start': '8px',
        marginBottom: '8px',
        backgroundColor: task.completed ? '#f0f9f0' : '#ffffff',
        borderLeft: `4px solid ${task.completed ? '#10B981' : '#3B82F6'}`
      }}
    >
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={onToggle}
        style={{ marginRight: '12px' }}
      />

      <IonLabel style={{ flex: 1 }}>
        <IonText
          style={{
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#6B7280' : '#1F2937',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          {task.text}
        </IonText>
        <br />
        <IonText
          color="medium"
          style={{
            fontSize: '12px',
            marginTop: '4px'
          }}
        >
          {formatTime(task.createdAt)}
        </IonText>
      </IonLabel>

      {task.priority && (
        <IonChip
          color={getPriorityColor(task.priority)}
          style={{ marginRight: '8px' }}
        >
          {task.priority}
        </IonChip>
      )}

      <IonButton
        fill="clear"
        color="danger"
        slot="end"
        onClick={onDelete}
        style={{ '--padding-start': '8px', '--padding-end': '8px' }}
      >
        <IonIcon icon={trash} />
      </IonButton>
    </IonItem>
  );
};

export default TaskItem;
