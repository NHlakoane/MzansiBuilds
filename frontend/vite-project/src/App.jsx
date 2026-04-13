import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ backgroundColor: '#111', padding: '15px', borderBottom: '1px solid #00ff00', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ color: '#00ff00', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none' }}>MzansiBuilds</Link>
      <div>
        <Link to="/feed" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Feed</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Dashboard</Link>
            <button onClick={logout} style={{ backgroundColor: '#333', color: '#fff', padding: '5px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/celebration" element={<CelebrationWall />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;