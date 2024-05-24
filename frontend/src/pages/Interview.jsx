import React from 'react';
import '../css/Interview.css';
import { useNavigate } from 'react-router-dom';
const Interview = () => {


  const navigate = useNavigate();

  const handleTakeInterview = (cardName) => {
    navigate('/record', { state: { cardName: cardName } });
  };

  return (
    <div className="interview-container">
      <div className="card">
     
        <h2>Database Management Systems</h2>
        <h3>Topics Covered</h3>
        <ul>

          <li>Database Architecture</li>
          <li>Database Design</li>
          <li>Normalization</li>
          <li>Transactions and Concurrency Control</li>
          <li>Deadlocks</li>
          <li>Indexes and Views</li>
        </ul>
        <button className="take-interview-button" onClick={() => handleTakeInterview('dbms')}>Take Interview</button>
      </div>

      <div className="card">
        <h2>Operating Systems</h2>
        <h3>Topics Covered</h3>
        <ul>
          <li>Introduction to Operating Systems</li>
          <li>Process Management</li>
          <li>Memory Management</li>
          <li>File Systems</li>
          <li>Networking</li>
          <li>Deadlocks and recovery</li>
        </ul>
        <button className="take-interview-button" onClick={() => handleTakeInterview('os')}>Take Interview</button>
      </div>
      <div className="card">
        <h2>Computer Networks</h2>
        <h3>Topics Covered</h3>
        <ul>
          <li>Introduction to Computer Networks</li>
          <li>Network Models</li>
          <li>Transmission Media</li>
          <li>Network Devices</li>
          <li>Routing Algorithms</li>
          <li>Network Security</li>
        </ul>
        <button className="take-interview-button" onClick={() => handleTakeInterview('cn')}>Take Interview</button>
      </div>

      <div className="card">
        <h2>Data Structures and Algorithms</h2>
        <h3>Topics Covered</h3>
        <ul>
          <li>Arrays and Linked Lists</li>
          <li>Stacks and Queues</li>
          <li>Trees and Graphs</li>
          <li>Sorting and Searching</li>
          <li>Dynamic Programming</li>
          <li>Algorithm Analysis</li>
        </ul>
        <button className="take-interview-button" onClick={() => handleTakeInterview('dsa')}>Take Interview</button>
      </div>

      <div className="card">
        <h2>Web Development</h2>
        <h3>Topics Covered</h3>
        <ul>
          <li>HTML and CSS</li>
          <li>JavaScript</li>
          <li>Frontend Frameworks (React, Angular, Vue)</li>
          <li>Backend Technologies (Node.js, Django, Flask)</li>
          <li>Database Management</li>
          <li>Web Security</li>
        </ul>
        <button className="take-interview-button" onClick={() => handleTakeInterview('web')}>Take Interview</button>
      </div>

      <div className="card">
        <h2>Object Oriented Programming</h2>
        <h3>Topics Covered</h3>
        <ul>
          <li>Classes and Objects</li>
          <li>Inheritance and Polymorphism</li>
          <li>Encapsulation and Abstraction</li>
          <li>Interfaces and Abstract Classes</li>
          <li>Design Patterns</li>
          <li>Object-oriented Analysis and Design</li>
        </ul>
        <button className="take-interview-button" onClick={() => handleTakeInterview('oops')}>Take Interview</button>
      </div>

    </div>
  );
};

export default Interview;
