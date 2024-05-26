import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import '../css/Index.css';
import LoginModal from '../pages/LoginModal.jsx';

import 'react-toastify/dist/ReactToastify.css';

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isAuthenticated = !!localStorage.getItem('user');
    const navigate = useNavigate();

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div >
            <div className="header_container">
                <nav>
                    <Link to={'/'} style={{ textDecoration: 'none' }}>
                        <h1>techReady.<span id='ai'>ai</span></h1>
                    </Link>
                    <ul>
                        {isAuthenticated ? (
                            <>
                                <li><Link to={"/profile"} style={{ textDecoration: 'none', color: 'white' }}>Profile</Link></li>
                                <li onClick={handleLogout}>Logout</li>
                            </>
                        ) : (
                            <li onClick={toggleModal}><FaUser id='icon' />Login</li>
                        )}
                    </ul>
                </nav>
            </div>

            <LoginModal isOpen={isModalOpen} onClose={toggleModal} />


        </div>
    );
}
