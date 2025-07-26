import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get('/notifications/my');
        setNotifications(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load notifications');
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!user) return;
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.emit('register', user.id);
    socket.on('notification', notif => {
      setNotifications(prev => [notif, ...prev]);
    });
    return () => socket.disconnect();
  }, [user]);

  return (
    <div>
      <h3>My Notifications</h3>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="alert alert-info">No notifications yet.</div>
      ) : (
        <ul className="list-group">
          {notifications.map(n => (
            <li className="list-group-item" key={n._id}>
              <strong>{n.title}</strong>
              <div>{n.message}</div>
              <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserNotifications; 