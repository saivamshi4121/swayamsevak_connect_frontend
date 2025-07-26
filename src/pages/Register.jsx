import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import { FaUserPlus } from 'react-icons/fa';

const designations = [
  'Swayamsevak',
  'Karyakarta',
  'Shakha Pramukh',
  'IT Milan Sanchalak',
  'Varg Pramukh',
  'Other',
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [age, setAge] = useState('');
  const [designation, setDesignation] = useState('');
  const [shakha, setShakha] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Debug: Log all form values
    console.log('Form values:', {
      name: name.trim(),
      email: email.trim(),
      number: number.trim(),
      age: age.toString().trim(),
      designation: designation.trim(),
      shakha: shakha.trim(),
      password: password.trim()
    });
    
    // Check each field individually for better error messages
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!number.trim()) {
      setError('Mobile number is required.');
      return;
    }
    if (!age.toString().trim()) {
      setError('Age is required.');
      return;
    }
    if (!designation.trim()) {
      setError('Please select a designation.');
      return;
    }
    if (!shakha.trim()) {
      setError('Shakha name is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }
    
    const res = await register(name.trim(), email.trim(), password, {
      number: number.trim(),
      age: age.toString().trim(),
      designation: designation.trim(),
      shakha: shakha.trim(),
    });
    if (res.success) {
      setSuccess('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{background:'#f8fafc'}}>
      <div className="signup-row-fullheight w-100 m-0 p-0">
        <div className="signup-col-img">
          <img src={require('../assets/registerimg.jpg')} alt="Register visual" className="img-fluid" />
        </div>
        <div className="signup-col-form">
          <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{maxWidth:540, minHeight:'90vh', padding:'4rem 2rem'}}>
            <div className="text-center mb-3">
              <img src={require('../assets/logomain.jpg')} alt="logo" width={36} className="mb-2" />
              <h2 className="fw-bold mb-1" style={{fontSize:'1.5rem'}}>Create Account</h2>
              <div className="text-muted small mb-1">Join Swayamsevak Connect</div>
              <div className="small text-secondary fst-italic mb-2">"Seva is the highest dharma."</div>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off" className="w-100" style={{maxWidth:400}}>
              <div className="mb-2">
                <input type="text" className="form-control form-control-sm" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required autoFocus />
              </div>
              <div className="mb-2">
                <input type="email" className="form-control form-control-sm" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-2">
                <input type="tel" className="form-control form-control-sm" placeholder="Mobile Number" value={number} onChange={e => setNumber(e.target.value)} required pattern="[0-9]{10}" maxLength={10} />
              </div>
              <div className="mb-2">
                <input type="number" className="form-control form-control-sm" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} required min={10} max={100} />
              </div>
              <div className="mb-2">
                <select className="form-select form-select-sm" value={designation} onChange={e => setDesignation(e.target.value)} required>
                  <option value="" disabled>Designation</option>
                  {designations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="mb-2">
                <input type="text" className="form-control form-control-sm" placeholder="Current Shakha Name" value={shakha} onChange={e => setShakha(e.target.value)} required />
              </div>
              <div className="mb-2">
                <input type="password" className="form-control form-control-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <div className="alert alert-danger small py-1 mb-2">{error}</div>}
              {success && <div className="alert alert-success small py-1 mb-2">{success}</div>}
              <button type="submit" className="btn btn-primary btn-sm w-100 mb-1" disabled={loading}>
                {loading ? 'Registering...' : 'Sign Up'}
              </button>
            </form>
            <div className="text-center mt-1">
              <Link to="/login" className="small">Already have an account? Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 