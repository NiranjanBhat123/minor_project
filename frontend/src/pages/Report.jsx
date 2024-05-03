import React from 'react';
import { useLocation } from 'react-router-dom';
import '../css/Report.css';


const preprocessText = (text) => {
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
  const { response } = state;

  const rating = response.rating ? parseFloat(response.rating) : 0;
  let ratingColor = '';
  let ratingText = ''
  if (rating <= 5) {
    ratingColor = 'red';
    ratingText = 'Poor'
  } else if (rating <= 7) {
    ratingColor = 'orange';
    ratingText = 'Average'
  } else {
    ratingColor = 'green';
    ratingText = 'Excellent'
  }

  return (
    <div className="report-container">
      <h2 className="report-heading">Your Report</h2>
      {response ? (
        <div className="report-data">
          <div className="report-section rating-section">
          <span style={{fontSize:"1.5rem", color:`${ratingColor}`}}>{ratingText}</span>
            <br />
            <div className="rating-graph" style={{ border: `10px solid ${ratingColor}` }}>
            
              <span style={{fontSize:"3rem"}}>{rating}/</span>10
            </div>
           
          </div>
          <div className="report-section feedback-section">
            <h3>Feedback:</h3>
            {preprocessText(response.feedback)}
          </div>
          <div className="report-section strengths-section">
            <h3>Strengths:</h3>
            {preprocessText(response.strengths)}
          </div>
          <div className="report-section model-answer-section">
            <h3>Model Answer:</h3>
            {preprocessText(response.model_anwer)}
          </div>
        </div>
      ) : (
        <p>No data received</p>
      )}
    </div>
  );
};

export default Report;
