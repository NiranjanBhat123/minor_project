import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/LoginModal.css';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginModal = ({ isOpen, onClose }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showcnfPassword, setShowcnfPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const toggleSignup = () => {
    setShowSignup(!showSignup);
    setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const formData = new FormData();
      formData.append('email', email);
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('http://127.0.0.1:8000/my_app/api/signup/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }

      
      setShowSignup(false);
      setError('')
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch('http://127.0.0.1:8000/my_app/api/login/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }

      localStorage.setItem('user', JSON.stringify(data));
     
      setError('')
      onClose();
      navigate('/interview');
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const validateForm = () => {
    if (showSignup) {
      setIsFormValid(email !== '' && username !== '' && password !== '');
    } else {
      setIsFormValid(email !== '' && password !== '');
    }
  };

  useEffect(() => {
    validateForm();
  }, [email, username, password, showSignup]);


  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <FaTimes className="close-icon" onClick={onClose} />
          <h2>{showSignup ? "Signup" : "Login"}</h2>
          {error && <div className="error-message">{error}</div>}
          {showSignup ? (
            <form className="form" onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="signup-username">Username</label>
                <input type="text" id="signup-username" name="signup-username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input type="email" id="signup-email" name="signup-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input type={showPassword ? 'text' : 'password'} id="signup-password" name="signup-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {showPassword ? <FaEyeSlash id='eyes' onClick={() => setShowPassword(false)} /> : <FaEye onClick={() => setShowPassword(true)} />}
              </div>
              <div className="form-group">
                <label htmlFor="signup-confirmpassword">Confirm Password</label>

                <input type={showcnfPassword ? 'text' : 'password'} id="signup-confirmpassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                {showcnfPassword ? <FaEyeSlash id='eyes' onClick={() => setShowcnfPassword(false)} /> : <FaEye onClick={() => setShowcnfPassword(true)} />}

              </div>
              <button type="submit" disabled={!isFormValid} style={{ backgroundColor: isFormValid ? 'purple' : 'gray' }}>Signup</button>

            </form>
          ) : (
            <form className="form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input type="email" id="login-email" name="login-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input type={showPassword ? 'text' : 'password'} id="login-password" name="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {showPassword ? <FaEyeSlash id='eyes' onClick={() => setShowPassword(false)} /> : <FaEye onClick={() => setShowPassword(true)} />}
              </div>
              <button type="submit" disabled={!isFormValid} style={{ backgroundColor: isFormValid ? 'purple' : 'gray' }}>Login</button>
            </form>
          )}
          <p>{showSignup ? "Already have an account? " : "Don't have an account? "}
            <span className="link" onClick={toggleSignup}>
              {showSignup ? "Login" : "Signup"}
            </span>
          </p>
        </div>
        <ToastContainer />
      </div>
    )
  );
};

export default LoginModal;





