import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { EventsContainer } from './components/EventsContainer';
import { EventsService } from './services/EventsService';
import { EventsProvider } from './context/EventsContext';
import './styles/events.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const EventsMicrofrontend = ({ 
  selectedDate, 
  onDateSelect, 
  user,
  theme = 'forest',
  locale = 'es'
}) => {
  const [eventsService] = useState(() => new EventsService());

  return (
    <QueryClientProvider client={queryClient}>
      <EventsProvider eventsService={eventsService}>
        <div className="events-microfrontend" data-theme={theme} data-locale={locale}>
          <EventsContainer
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            user={user}
          />
        </div>
      </EventsProvider>
    </QueryClientProvider>
  );
};

export default EventsMicrofrontend;
