import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Try different username/email.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', backgroundColor: '#111', borderRadius: '8px' }}>
      <h1 style={{ color: '#00ff00', textAlign: 'center' }}>Register</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#222', color: 'white', border: '1px solid #00ff00', borderRadius: '4px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#222', color: 'white', border: '1px solid #00ff00', borderRadius: '4px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#222', color: 'white', border: '1px solid #00ff00', borderRadius: '4px' }}
        />
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#222', color: 'white', border: '1px solid #00ff00', borderRadius: '4px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#00ff00', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <Link to="/login" style={{ color: '#00ff00' }}>Login</Link>
      </p>
    </div>
  );
}