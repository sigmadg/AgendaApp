import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { EventsList } from './EventsList';
import { EventForm } from './EventForm';
import { EventsHeader } from './EventsHeader';
import { useEvents } from '../hooks/useEvents';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

export const EventsContainer = ({ selectedDate, onDateSelect, user }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const { events, loading, error, addEvent, updateEvent, deleteEvent } = useEvents();

  const handleAddEvent = async (eventData) => {
    try {
      await addEvent.mutateAsync({
        ...eventData,
        userId: user.id,
        date: selectedDate.toISOString(),
      });
      toast.success('Evento agregado exitosamente');
      setShowForm(false);
    } catch (error) {
      toast.error('Error al agregar evento');
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await updateEvent.mutateAsync(eventData);
      toast.success('Evento actualizado exitosamente');
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      toast.error('Error al actualizar evento');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent.mutateAsync(eventId);
      toast.success('Evento eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar evento');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const dayEvents = events?.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  }) || [];

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <div className="error-message">
          <p>Error al cargar eventos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <EventsHeader
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onAddEvent={() => setShowForm(true)}
        eventCount={dayEvents.length}
      />

      {showForm && (
        <EventForm
          event={editingEvent}
          selectedDate={selectedDate}
          onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
          onCancel={handleCloseForm}
        />
      )}

      <EventsList
        events={dayEvents}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onAddEvent={() => setShowForm(true)}
      />
    </div>
  );
};
