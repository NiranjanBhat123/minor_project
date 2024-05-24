import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/Report.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave } from 'react-icons/fa'; // Import the save icon from React Icons

const preprocessText = (text) => {
  if (!text) return null; // Handle case where text is undefined
  return text.split('\n\n').map((paragraph, index) => {
    if ((paragraph.startsWith('**') && paragraph.endsWith('**'))) {
      return <p key={index}><strong>{paragraph.slice(2, -2)}</strong></p>;
    }
    else if((paragraph.startsWith('* **') && paragraph.endsWith(':**'))){
      return <p key={index}><strong>{paragraph.slice(4, -4)}</strong></p>;
    } 
    else {
      return <p style={{textAlign:"justify"}} key={index}>{paragraph}</p>;
    }
  });
};

const Report = () => {
  const { state } = useLocation();
  const { rating, user_answer, feedback, strengths, model_answer, question_id } = state;

  const [reportSaved, setReportSaved] = useState(false); // State variable to track if report has been saved

  const user = JSON.parse(localStorage.getItem('user'));
  const userEmail = user ? user.email : '';

  const ratingValue = rating ? parseFloat(rating) : 0;
  let ratingColor = '';
  let ratingText = '';
  if (ratingValue <= 5) {
    ratingColor = 'red';
    ratingText = 'Poor';
  } else if (ratingValue <= 7) {
    ratingColor = 'orange';
    ratingText = 'Average';
  } else {
    ratingColor = 'green';
    ratingText = 'Excellent';
  }

  const handleSaveReport = async () => {
    if (reportSaved) {
      toast.info('Report is already saved!');
      return;
    }

    try {
      const reportData = {
        email: userEmail,
        rating,
        user_answer,
        feedback,
        question_id
      };

      const res = await fetch('http://127.0.0.1:8000/my_app/api/save_report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!res.ok) {
        throw new Error('Failed to save report');
      }

      const data = await res.json();
      console.log(data.message);
      toast.success("report saved sucessfully !")
      setReportSaved(true); // Set reportSaved to true after successfully saving the report
    } catch (error) {
      console.error('Error saving report:', error.message);
      alert('Failed to save report');
    }
  };

  return (
    <div className="report-container">
      <button 
        onClick={handleSaveReport}  
        id='save_report'
        style={{ backgroundColor: reportSaved ? 'gray' : 'purple' }} // Change button color if disabled
      >
        <FaSave /> Save Report
      </button>
      <h2 className="report-heading">Your Report</h2>
        <div className="report-data">
          
          {/* <div className="report-section feedback-section">
            <h3>Your answer:</h3>
            {preprocessText(user_answer)}
          </div> */}
          <div className="report-section rating-section">
            
            <span style={{ fontSize: '1.5rem', color: `${ratingColor}` }}>{ratingText}</span>
            
            <br />
            <div className="rating-graph" style={{ border: `10px solid ${ratingColor}` }}>
              <span style={{ fontSize: '3rem' }}>{ratingValue}/</span>10
            </div>
          </div>
          <div className="report-section feedback-section">
            <h3>Feedback:</h3>
            {preprocessText(feedback)}
          </div>
          <div className="report-section strengths-section">
            <h3>Strengths:</h3>
            {preprocessText(strengths)}
          </div>
          <div className="report-section model-answer-section">
            <h3>Model Answer:</h3>
            {preprocessText(model_answer)}
          </div>
          <ToastContainer/>
        </div>
    </div>
  );
};

export default Report;


