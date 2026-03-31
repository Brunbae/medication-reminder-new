import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <h2 className="logo">Rappel Médicaments</h2>
      <ul>
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/rappels" className={location.pathname === '/rappels' ? 'active' : ''}>
            Programmer
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            Tableau de Bord
          </Link>
        </li>
        <li>
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
            Connexion
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
