import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const EventsContext = createContext();

const eventsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false, error: null };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        )
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    default:
      return state;
  }
};

const initialState = {
  events: [],
  loading: false,
  error: null,
  filters: {
    date: null,
    category: null,
    status: null,
  },
  sort: {
    field: 'date',
    direction: 'asc',
  },
};

export const EventsProvider = ({ children, eventsService }) => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);
  const queryClient = useQueryClient();

  // Query para obtener eventos
  const { data: events, isLoading, error } = useQuery(
    'events',
    () => eventsService.getEvents(),
    {
      onSuccess: (data) => {
        dispatch({ type: 'SET_EVENTS', payload: data });
      },
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error });
      },
    }
  );

  // Mutación para crear evento
  const addEventMutation = useMutation(
    (eventData) => eventsService.createEvent(eventData),
    {
      onSuccess: (newEvent) => {
        dispatch({ type: 'ADD_EVENT', payload: newEvent });
        queryClient.invalidateQueries('events');
      },
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error });
      },
    }
  );

  // Mutación para actualizar evento
  const updateEventMutation = useMutation(
    ({ eventId, eventData }) => eventsService.updateEvent(eventId, eventData),
    {
      onSuccess: (updatedEvent) => {
        dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent });
        queryClient.invalidateQueries('events');
      },
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error });
      },
    }
  );

  // Mutación para eliminar evento
  const deleteEventMutation = useMutation(
    (eventId) => eventsService.deleteEvent(eventId),
    {
      onSuccess: (_, eventId) => {
        dispatch({ type: 'DELETE_EVENT', payload: eventId });
        queryClient.invalidateQueries('events');
      },
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error });
      },
    }
  );

  const value = {
    ...state,
    eventsService,
    addEvent: addEventMutation,
    updateEvent: updateEventMutation,
    deleteEvent: deleteEventMutation,
    setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    setSort: (sort) => dispatch({ type: 'SET_SORT', payload: sort }),
    clearError: () => dispatch({ type: 'SET_ERROR', payload: null }),
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents debe ser usado dentro de EventsProvider');
  }
  return context;
};
