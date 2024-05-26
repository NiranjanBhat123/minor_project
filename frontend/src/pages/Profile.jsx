import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaUserCircle, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Profile.css';

export default function Profile() {
  const [profileData, setProfileData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const user = JSON.parse(localStorage.getItem('user'));

  const genres = [
    'Web development',
    'Data structures and algorithms',
    'Computer Networks',
    'Object Oriented Programming',
    'Operating systems',
    'Database Management system'
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchProfile = async () => {
    try {
      if (user && user.email) {
        const url = `http://localhost:8000/my_app/api/profile/${user.email}`;
        const response = await axios.get(url);

        if (response.status !== 200) {
          throw new Error('Failed to fetch profile data from server');
        }

        setProfileData(response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (user && profileData.length === 0 && !error) {
      fetchProfile();
    }
  }, []);

  const openModal = (reportId) => {
    setReportToDelete(reportId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setReportToDelete(null);
    setModalIsOpen(false);
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      const url = `http://localhost:8000/my_app/api/report/${reportToDelete}/delete/`;
      const response = await axios.delete(url);

      if (response.status === 200) {
        toast.success('Report deleted successfully');
        closeModal();
        fetchProfile();
      }
    } catch (error) {
      toast.error('Internal server error');
      console.error('Error deleting report:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'timeFilter') {
      setTimeFilter(value);
    } else if (name === 'genreFilter') {
      setGenreFilter(value);
    }
    applyFilter(value, name);
  };

  const applyFilter = (value, filterType) => {
    let filtered = profileData;

    if (filterType === 'timeFilter') {
      if (value === 'latest') {
        filtered = [...profileData].sort((a, b) => new Date(b.submit_time) - new Date(a.submit_time));
      } else if (value === 'earliest') {
        filtered = [...profileData].sort((a, b) => new Date(a.submit_time) - new Date(b.submit_time));
      }
    } else if (filterType === 'genreFilter' && value !== 'all') {
      filtered = profileData.filter(report => report.genre_name === value);
    }

    setFilteredData(filtered);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-info">
          <FaUserCircle className="user-icon" />
          <div>
            <h3 className="user-name">{user.username}</h3>
            <h3 className="user-email">{user.email}</h3>
          </div>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="filter-container">
        <label htmlFor="timeFilter">Filter by Timeline: </label>
        <select name="timeFilter" id="timeFilter" value={timeFilter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="latest">Latest</option>
          <option value="earliest">Earliest</option>
        </select>

        <label htmlFor="genreFilter"> Filter by Genre: </label>
        <select name="genreFilter" id="genreFilter" value={genreFilter} onChange={handleFilterChange}>
          <option value="all">All</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      <div className="profile-details">
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Your Reports</h1>
        {filteredData.length > 0 ? (
          filteredData.map((report, index) => (
            <div key={index} className="card">
              <div className="card-header">
                <p className="genre">{report.genre_name}</p>
                <FaTrash className="delete-icon" onClick={() => openModal(report.id)} />
              </div>
              <div className="card-body">
                <div className="grid-container">
                  <div className="grid-item">
                    <p style={{ color: "purple" }}><strong>Question:</strong></p>
                    <p>{report.question}</p>
                  </div>
                  <div className="grid-item">
                    <p style={{ color: "purple" }}><strong>Rating:</strong></p>
                    <p className="rating" style={{ color: 'black' }}>{report.rating}/10</p>
                  </div>
                  <div className="grid-item">
                    <p style={{ color: "purple" }}><strong>User Answer:</strong></p>
                    <p>{report.user_answer}</p>
                  </div>
                  <div className="grid-item">
                    <p style={{ color: "purple" }}><strong>Feedback:</strong></p>
                    <p>{report.feedback}</p>
                  </div>
                  <div className="grid-item">
                    <p style={{ color: "purple" }}><strong>Date: </strong><span style={{ color: "black" }}>{formatDate(report.submit_time)}</span> </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 style={{ textAlign: "center" }}>No reports yet!</h2>
        )}
        <ToastContainer />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this report?</p>
        <button onClick={handleDeleteReport} className="modal-button confirm-button">Confirm</button>
        <button onClick={closeModal} className="modal-button cancel-button">Cancel</button>
      </Modal>
    </div>
  );
}

