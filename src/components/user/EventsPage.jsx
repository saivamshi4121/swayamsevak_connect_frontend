import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interestLoading, setInterestLoading] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get('/events');
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Real-time updates with Socket.io
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.on('event:created', event => {
      setEvents(prev => [event, ...prev]);
    });
    socket.on('event:updated', updated => {
      setEvents(prev => prev.map(ev => ev._id === updated._id ? updated : ev));
    });
    socket.on('event:deleted', ({ _id }) => {
      setEvents(prev => prev.filter(ev => ev._id !== _id));
    });
    socket.on('event:interest', updated => {
      setEvents(prev => prev.map(ev => ev._id === updated._id ? updated : ev));
    });
    return () => socket.disconnect();
  }, []);

  const isInterested = (event) => event.participants?.some(p => (p._id || p) === user?.id);

  const handleInterest = async (eventId, interested) => {
    setInterestLoading(eventId);
    try {
      if (interested) {
        const res = await api.delete(`/events/${eventId}/interest`);
        setEvents(events => events.map(ev => ev._id === eventId ? res.data : ev));
      } else {
        const res = await api.post(`/events/${eventId}/interest`);
        setEvents(events => events.map(ev => ev._id === eventId ? res.data : ev));
      }
    } catch (err) {
      alert('Failed to update interest');
    }
    setInterestLoading('');
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">Events</h2>
      {loading ? (
        <div>Loading events...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : events.length === 0 ? (
        <div className="alert alert-info">No upcoming events found.</div>
      ) : (
        <div className="row g-4">
          {events.map(event => {
            const interested = isInterested(event);
            return (
              <div className="col-md-6 col-lg-4" key={event._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{event.eventName}</h5>
                    <div className="mb-2 text-muted small">
                      {event.date ? new Date(event.date).toLocaleString() : ''} | {event.type} | {event.region}
                    </div>
                    <p className="card-text">{event.description}</p>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <button
                        className={`btn btn-${interested ? 'success' : 'outline-primary'} btn-sm`}
                        disabled={interestLoading === event._id}
                        onClick={() => handleInterest(event._id, interested)}
                      >
                        {interestLoading === event._id
                          ? 'Updating...'
                          : interested ? 'Not Interested' : 'Interested'}
                      </button>
                      <span className="text-muted small">{event.participants?.length || 0} interested</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsPage; 