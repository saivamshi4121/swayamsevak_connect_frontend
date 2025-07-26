import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const slideshowImages = [
  require('../assets/slideshow1.jpg'),
  require('../assets/slideshow2.jpg'),
  require('../assets/slideshow3.jpg'),
  require('../assets/slideshow4.jpg'),
  require('../assets/slideshow5.jpg'),
  require('../assets/slideshow6.jpg'),

];

const stories = [
  {
    title: 'Seva Project Success',
    text: 'Over 1000 meals served in our recent food drive, thanks to dedicated swayamsevaks.',
    img: require('../assets/slideshow1.jpg'),
  },
  {
    title: 'Youth Leader Spotlight',
    text: 'Meet Priya, who started a new shakha in her town and inspired dozens of youth.',
    img: require('../assets/slideshow2.jpg'),
  },
  {
    title: 'Cultural Event Impact',
    text: 'Our annual Milan brought together 500+ participants for games, learning, and tradition.',
    img: require('../assets/slideshow3.jpg'),
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const res = await api.get('/events');
        setEvents(res.data);
        setLoadingEvents(false);
      } catch (error) {
        console.log('Events fetch failed:', error.message);
        setLoadingEvents(false);
        // Don't redirect, just show empty state
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx(idx => (idx + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = (eventId) => {
    if (!user) {
      setShowModal(true);
    } else {
      // Future: navigate(`/user/events/${eventId}`);
    }
  };

  return (
    <div className="landing-hero-premium">
      {/* Hero Section with slideshow and CTA only */}
      <div className="hero-bg-premium position-relative">
        <div className="hero-slideshow-bg">
          {slideshowImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`slide${idx+1}`}
              className={`hero-slideshow-img${slideIdx === idx ? ' active' : ''}`}
              style={{opacity: slideIdx === idx ? 1 : 0}}
            />
          ))}
        </div>
        <div className="hero-cta-overlay d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 w-100 h-100" style={{zIndex:2}}>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button className="btn btn-lg btn-primary px-4" onClick={() => navigate('/shakha-locator')}>Join a Shakha Near You</button>
            <button className="btn btn-lg btn-secondary px-4" onClick={() => navigate('/events')}>Explore Events & Projects</button>
          </div>
        </div>
      </div>
      {/* Public Events List */}
      <div className="container my-5">
        <h2 className="mb-4 text-center saffron-text">Upcoming Events</h2>
        {loadingEvents ? (
          <div className="text-center">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="alert alert-info text-center">No upcoming events found.</div>
        ) : (
          <div className="row g-4 justify-content-center">
            {events.map(event => (
              <div className="col-md-6 col-lg-4" key={event._id}>
                <div className="card h-100 shadow-sm premium-story-card">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{event.eventName}</h5>
                    <div className="mb-2 text-muted small">
                      {event.date ? new Date(event.date).toLocaleString() : ''} | {event.type} | {event.region}
                    </div>
                    <p className="card-text">{event.description}</p>
                    <button className="btn btn-outline-primary mt-2" onClick={() => handleViewDetails(event._id)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Scroll-triggered Stories */}
      <div className="container my-5">
        <h2 className="mb-4 text-center saffron-text">Stories of Impact</h2>
        <div className="row g-4">
          {stories.map((story, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card h-100 shadow-sm premium-story-card">
                <img src={story.img} className="card-img-top" alt={story.title} style={{height:220,objectFit:'cover'}} />
                <div className="card-body">
                  <h5 className="card-title text-primary">{story.title}</h5>
                  <p className="card-text">{story.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Login/Signup Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sign in or Create an Account</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p className="mb-3">To view event details, please sign in or create a free account.</p>
                <button className="btn btn-primary me-2" onClick={() => navigate('/login')}>Sign In</button>
                <button className="btn btn-secondary" onClick={() => navigate('/register')}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing; 