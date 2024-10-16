import React from 'react';
import './Header.css';
import logo from './cft_logo.png'; 

function Header() {
  return (
    <nav>
      <div className="logo">
        <img src={logo} alt="Cornell FinTech Logo" className="logo-img" />
      </div>
      <ul>
        <li><button className="nav-link" onClick={() => console.log('Navigate to Home')}>Home</button></li>
      </ul>
      <div className="auth-buttons">
        <button>Login</button>
        <button>Sign Up</button>
      </div>
    </nav>
  );
}

export default Header;
