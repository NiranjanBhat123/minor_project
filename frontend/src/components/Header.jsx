import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import '../css/Index.css';

export default function Header() {
    return (
        <div>
            <div className="header_container">
                <nav>
                    <Link to={'/'} style={{ textDecoration: 'none' }}>
                        <h1>techReady.<span id='ai'>ai</span></h1>
                    </Link>
                    <ul>
                        <li><FaUser id='icon' />Login</li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}




