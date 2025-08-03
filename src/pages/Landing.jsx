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
    stats: '1000+ Meals',
  },
  {
    title: 'Youth Leader Spotlight',
    text: 'Meet Priya, who started a new shakha in her town and inspired dozens of youth.',
    img: require('../assets/slideshow2.jpg'),
    stats: '50+ Youth',
  },
  {
    title: 'Cultural Event Impact',
    text: 'Our annual Milan brought together 500+ participants for games, learning, and tradition.',
    img: require('../assets/slideshow3.jpg'),
    stats: '500+ Participants',
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const res = await api.get('/events/public');
        setEvents(res.data);
        setLoadingEvents(false);
      } catch (error) {
        console.log('Events fetch failed:', error.message);
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx(idx => (idx + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleViewDetails = (eventId) => {
    if (!user) {
      setShowModal(true);
    } else {
      // Future: navigate(`/user/events/${eventId}`);
    }
  };

  return (
    <div className="landing-hero-modern">
      {/* Modern Hero Section */}
      <div className="hero-section-modern">
        <div className="hero-background">
          {slideshowImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`slide${idx+1}`}
              className={`hero-slide${slideIdx === idx ? ' active' : ''}`}
            />
          ))}
          <div className="hero-overlay-modern"></div>
        </div>
        
        <div className="hero-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                <div className={`hero-text ${isVisible ? 'animate-in' : ''}`}>
                  <h1 className="hero-title">
                    <span className="hero-title-main">Swayamsevak</span>
                    <span className="hero-title-sub">Connect</span>
                  </h1>
                  <p className="hero-subtitle">
                    Uniting volunteers, fostering community, and building a stronger Bharat together
                  </p>
                  <div className="hero-stats">
                    <div className="stat-item">
                      <span className="stat-number">1000+</span>
                      <span className="stat-label">Volunteers</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">50+</span>
                      <span className="stat-label">Shakhas</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">100+</span>
                      <span className="stat-label">Events</span>
                    </div>
                  </div>
                  <div className="hero-actions">
                    <button 
                      className="btn btn-primary btn-lg hero-btn-primary" 
                      onClick={() => navigate('/shakha-locator')}
                    >
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Find Your Shakha
                    </button>
                    <button 
                      className="btn btn-outline-light btn-lg hero-btn-secondary" 
                      onClick={() => navigate('/events')}
                    >
                      <i className="fas fa-calendar-alt me-2"></i>
                      Explore Events
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </div>

      {/* Events Section */}
      <section className="events-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Join our community activities and make a difference</p>
          </div>
          
          {loadingEvents ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-calendar-times"></i>
              <h3>No upcoming events</h3>
              <p>Check back soon for new activities!</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map(event => (
                <div className="event-card" key={event._id}>
                  <div className="event-card-header">
                    <div className="event-type-badge">{event.type}</div>
                    <div className="event-date">
                      {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                    </div>
                  </div>
                  <div className="event-card-body">
                    <h3 className="event-title">{event.eventName}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-meta">
                      <span className="event-location">
                        <i className="fas fa-map-marker-alt"></i>
                        {event.region}
                      </span>
                    </div>
                  </div>
                  <div className="event-card-footer">
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={() => handleViewDetails(event._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stories Section */}
      <section className="stories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Stories of Impact</h2>
            <p className="section-subtitle">Real stories from our community members</p>
          </div>
          
          <div className="stories-grid">
            {stories.map((story, idx) => (
              <div className="story-card" key={idx}>
                <div className="story-image">
                  <img src={story.img} alt={story.title} />
                  <div className="story-overlay">
                    <div className="story-stats">{story.stats}</div>
                  </div>
                </div>
                <div className="story-content">
                  <h3 className="story-title">{story.title}</h3>
                  <p className="story-text">{story.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of volunteers working together for a better tomorrow</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                Get Started Today
              </button>
              <button className="btn btn-outline-light btn-lg" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Login/Signup Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Join Our Community</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>To view event details and join activities, please create an account or sign in.</p>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Sign In
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/register')}>
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing; 