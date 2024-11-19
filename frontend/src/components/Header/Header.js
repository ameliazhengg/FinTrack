/**
 * Header Component
 * 
 * This component renders a navigation bar that includes a logo, navigation links, 
 * and authentication buttons for 'Login' and 'Sign Up'. The navigation bar is designed 
 * to be used at the top of the application, providing basic navigation functionality.
 * 
 * This component is primarily responsible for the layout and styling of the navigation bar,
 * but the actual navigation logic is currently not implemented.
 * 
 * Example usage:
 * <Header />
 */

import React from 'react';
import './Header.css';
import logo from './cft_logo.png';
import { useNavigate } from 'react-router-dom';
import 

/**
 * Header component: Renders a navigation bar with a logo, navigation links, and authentication buttons.
 * 
 * @returns {JSX.Element} - The rendered Header component.
 */

function Header() {
  const navigate = useNavigate();
  const handleLoginClick = () => navigate('/LoginPage');
  return (
    <nav>
      {/* Logo section */}
      <div className="logo">
        <img src={logo} alt="Cornell FinTech Logo" className="logo-img" />
      </div>

      {/* Navigation links */}
      <ul>
        <li>
          <button 
            className="nav-link" 
            onClick={() => console.log('Navigate to Home')}  // Placeholder navigation
          >
            Home
          </button>
        </li>
      </ul>

      {/* Authentication buttons */}
      <div className="auth-buttons">
      <button onClick={handleLoginClick}>Login</button>  {/* Login button placeholder */}
        <button>Sign Up</button>  {/* Sign-up button placeholder */}
      </div>
    </nav>
  );
}

export default Header;
