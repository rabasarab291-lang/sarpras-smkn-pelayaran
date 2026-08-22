import { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/authStore';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">📦</span>
            <span>Sarpras SMKN</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-blue-100 transition">
              Dashboard
            </Link>
            <Link to="/barang" className="hover:text-blue-100 transition">
              Barang
            </Link>
            <Link to="/kategori" className="hover:text-blue-100 transition">
              Kategori
            </Link>
            <Link to="/peminjaman" className="hover:text-blue-100 transition">
              Peminjaman
            </Link>
            <Link to="/laporan" className="hover:text-blue-100 transition">
              Laporan
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-700 px-3 py-2 rounded">
              <User size={18} />
              <span className="text-sm">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-blue-700 py-4 space-y-2">
            <Link to="/dashboard" className="block px-4 py-2 hover:bg-blue-800 rounded">
              Dashboard
            </Link>
            <Link to="/barang" className="block px-4 py-2 hover:bg-blue-800 rounded">
              Barang
            </Link>
            <Link to="/kategori" className="block px-4 py-2 hover:bg-blue-800 rounded">
              Kategori
            </Link>
            <Link to="/peminjaman" className="block px-4 py-2 hover:bg-blue-800 rounded">
              Peminjaman
            </Link>
            <Link to="/laporan" className="block px-4 py-2 hover:bg-blue-800 rounded">
              Laporan
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
