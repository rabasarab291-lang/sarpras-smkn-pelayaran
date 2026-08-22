import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Barang from './pages/Barang';
import Kategori from './pages/Kategori';
import Peminjaman from './pages/Peminjaman';
import Laporan from './pages/Laporan';
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';
import useStore from './store/authStore';

function App() {
  const { isAuthenticated } = useStore();

  return (
    <Router>
      <Notification />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/barang"
          element={
            <ProtectedRoute>
              <Barang />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kategori"
          element={
            <ProtectedRoute>
              <Kategori />
            </ProtectedRoute>
          }
        />
        <Route
          path="/peminjaman"
          element={
            <ProtectedRoute>
              <Peminjaman />
            </ProtectedRoute>
          }
        />
        <Route
          path="/laporan"
          element={
            <ProtectedRoute>
              <Laporan />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
