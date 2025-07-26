import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      // Navigate based on user role returned from backend
      navigate(res.user.role === 'admin' ? '/admin' : '/user');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="login-animated-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-glass-card p-4 shadow rounded-4 position-relative" style={{maxWidth: 350, width: '100%', zIndex:2}}>
        <div className="text-center mb-4">
          <img src={require('../assets/logomain.jpg')} alt="logo" width={48} className="mb-2" />
          <h2 className="fw-bold mb-1">Sign In</h2>
          <div className="text-muted">Welcome back to Swayamsevak Connect</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control form-control-lg" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control form-control-lg" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-danger small animate__animated animate__shakeX">{error}</div>}
          <button type="submit" className="btn btn-primary btn-lg w-100 mb-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-2">
          <Link to="/register" className="small">Don&apos;t have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 