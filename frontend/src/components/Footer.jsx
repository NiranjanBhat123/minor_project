import React from 'react';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <h3 style={{ textAlign: "left" }}>techReady.<span className="purple">ai</span></h3>
                <div className="footer-content">
                    <div className="contact-info">
                        <p>Email: techready@gmail.com</p>
                        <p>Phone: +91 9978976567</p>
                        <p>Address: techReady.ai Pvt.Ltd 123 Street, Whitefield,Banglore,India</p>
                    </div>
                    <div className="socials">
                        <div className="social_links">
                            <p style={{ fontSize: "1.6rem" }}>Socials</p>
                            <a style={{ padding: ".5rem" }} href="#" className="twitter"><FaTwitter size={28} /></a>
                            <a style={{ padding: ".5rem" }} href="#" className="instagram"><FaInstagram size={28} /></a>
                            <a style={{ padding: ".5rem" }} href="#" className="facebook"><FaFacebook size={28} /></a>
                            <a style={{ padding: ".5rem" }} href="#" className="linkedin"><FaLinkedin size={28} /></a>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <p>&copy; techReady.ai All rights reserved.</p>
                </div>
                <div className="terms-policies">
                    <p><a href="#">Terms and Conditions</a> | <a href="#">Privacy Policies</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
