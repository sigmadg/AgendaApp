import React, { useState, useMemo } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonButtons,
  IonText,
} from '@ionic/react';
import {
  calendar,
  add,
  chevronBack,
  chevronForward,
} from 'ionicons/icons';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface CalendarViewProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  tasks: { [key: string]: Task[] };
  events: (date: string) => Event[];
  onAddTask: () => void;
  onAddEvent: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  tasks,
  events,
  onAddTask,
  onAddEvent,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    return { daysInMonth, startingDayOfWeek };
  };

  const getMarkedDates = useMemo(() => {
    const marked: { [key: string]: { hasTasks: boolean; hasEvents: boolean; isSelected: boolean; tasksCompleted: number; totalTasks: number } } = {};

    // Marcar fecha seleccionada
    marked[selectedDate] = { ...marked[selectedDate], isSelected: true };

    // Marcar fechas con tareas
    Object.keys(tasks).forEach(date => {
      const dayTasks = tasks[date] || [];
      if (dayTasks.length > 0) {
        const completedTasks = dayTasks.filter(task => task.completed).length;
        marked[date] = {
          ...marked[date],
          hasTasks: true,
          tasksCompleted: completedTasks,
          totalTasks: dayTasks.length
        };
      }
    });

    // Marcar fechas con eventos
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    for (let day = 1; day <= 31; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events(dateString) || [];
      if (dayEvents.length > 0) {
        marked[dateString] = {
          ...marked[dateString],
          hasEvents: true
        };
      }
    }

    return marked;
  }, [selectedDate, tasks, events, currentDate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today.toISOString().split('T')[0]);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  // Ajustar para que la semana empiece en lunes (1) en lugar de domingo (0)
  const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const calendarDays = [];
  let dayCounter = 1;

  // Crear 6 semanas de calendario
  for (let week = 0; week < 6; week++) {
    const weekDays = [];

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if (week === 0 && dayOfWeek < adjustedStartingDay) {
        // Días del mes anterior
        weekDays.push(null);
      } else if (dayCounter > daysInMonth) {
        // Días del mes siguiente
        weekDays.push(null);
      } else {
        // Días del mes actual
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
        const isSelected = dateString === selectedDate;
        const markedInfo = markedDates[dateString];

        weekDays.push({
          day: dayCounter,
          dateString,
          isSelected,
          markedInfo
        });
        dayCounter++;
      }
    }

    calendarDays.push(weekDays);
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IonIcon icon={calendar} slot="start" />
          <span>Calendario</span>
          <IonButtons slot="end">
            <IonButton onClick={onAddEvent}>
              <IonIcon icon={calendar} />
            </IonButton>
            <IonButton onClick={onAddTask}>
              <IonIcon icon={add} />
            </IonButton>
          </IonButtons>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {/* Navegación del calendario */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <IonButton fill="clear" onClick={() => navigateMonth('prev')}>
            <IonIcon icon={chevronBack} />
          </IonButton>

          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <IonButton fill="clear" size="small" onClick={goToToday}>
              Hoy
            </IonButton>
          </div>

          <IonButton fill="clear" onClick={() => navigateMonth('next')}>
            <IonIcon icon={chevronForward} />
          </IonButton>
        </div>

        {/* Fecha seleccionada */}
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <IonText color="primary">
            <h4 style={{ margin: '0' }}>{formatDate(selectedDate)}</h4>
          </IonText>
        </div>

        {/* Calendario */}
        <IonGrid>
          {/* Encabezados de días */}
          <IonRow>
            {dayNames.map((day, index) => (
              <IonCol key={index} size="1.71" style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold', color: '#6b7280' }}>
                {day}
              </IonCol>
            ))}
          </IonRow>

          {/* Días del calendario */}
          {calendarDays.map((week, weekIndex) => (
            <IonRow key={weekIndex}>
              {week.map((dayInfo, dayIndex) => (
                <IonCol key={dayIndex} size="1.71">
                  {dayInfo ? (
                    <div
                      onClick={() => onDateSelect(dayInfo.dateString)}
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        backgroundColor: dayInfo.isSelected ? '#007AFF' : 'transparent',
                        color: dayInfo.isSelected ? 'white' : 'inherit',
                        position: 'relative',
                        minHeight: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span style={{ fontWeight: dayInfo.isSelected ? 'bold' : 'normal' }}>
                        {dayInfo.day}
                      </span>

                      {/* Indicadores visuales */}
                      <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                        {dayInfo.markedInfo?.hasTasks && (
                          <div
                            style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor: dayInfo.markedInfo.tasksCompleted === dayInfo.markedInfo.totalTasks ? '#10B981' : '#F59E0B'
                            }}
                          />
                        )}
                        {dayInfo.markedInfo?.hasEvents && (
                          <div
                            style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor: '#8B5CF6'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '8px', minHeight: '40px' }} />
                  )}
                </IonCol>
              ))}
            </IonRow>
          ))}
        </IonGrid>

        {/* Leyenda */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Leyenda</h4>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <small>Tareas completadas</small>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <small>Tareas pendientes</small>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
              <small>Eventos</small>
            </div>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default CalendarView;
