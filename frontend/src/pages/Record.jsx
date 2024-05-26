import React, { useState, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from 'react-video-recorder';
import { ReactTyped } from "react-typed";
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Record.css';
import { useRecordWebcam } from 'react-record-webcam';
import axios from 'axios';

const OPTIONS = {
  filename: 'test-filename',
  fileType: 'mp4',
  width: 1920,
  height: 1080,
};

const RecordView = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    video: true,
    facingMode: { exact: 'environment' },
  });

  return (
    <div>
      <p>{status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <video src={mediaBlobUrl} controls autoPlay loop />
    </div>
  );
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [question, setQuestion] = useState('');
  const [question_id, setquestion_id] = useState('')




  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let { cardName } = location.state;
  useEffect(() => {
    fetchQuestion();
  }, [cardName]);
  let subject = '';
  if (cardName === 'dbms') {
    subject = 'Database management system';
  } else if (cardName === 'os') {
    subject = 'Operating systems';
  } else if (cardName === 'cn') {
    subject = 'Computer networks';
  } else if (cardName === 'dsa') {
    subject = 'Data Structures and Algorithms';
  } else if (cardName === 'oops') {
    subject = 'Object oriented Programming';
  } else if (cardName === 'web') {
    subject = 'Web development';
  }

  const recordWebcam = useRecordWebcam(OPTIONS);

  const fetchQuestion = async () => {
    try {
      const url = `http://localhost:8000/my_app/api/get-random-question/${cardName}/`;
      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error('Failed to fetch question from server');
      }

      setQuestion(response.data.question);
      setquestion_id(response.data.id);
    } catch (error) {
      toast.error(error.message);
    }
  };



  const handleButtonClick = async () => {
    if (!isVideoRecorded) {
      toast.error('Record a video before submitting');
    } else {
      try {
        if (!recordedBlob) {
          throw new Error('No recorded video found');
        }
        setSubmitting(true);

        const formData = new FormData();
        formData.append('video', recordedBlob);
        formData.append('question_id', question_id);

        const response = await fetch('http://127.0.0.1:8000/my_app/', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {

          const responseData = await response.json();



          const extractedData = {
            rating: responseData.rating,
            user_answer: responseData.user_answer,
            feedback: responseData.feedback,
            strengths: responseData.strengths,
            model_answer: responseData.model_answer,
            question_id: question_id
          };


          navigate('/report', {
            state: {
              rating: responseData.rating,
              user_answer: responseData.user_answer,
              feedback: responseData.feedback,
              strengths: responseData.strengths,
              model_answer: responseData.model_answer,
              question_id: question_id
            }
          });
        } else {

          throw new Error('Internal server error');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };





  return (
    <>
      <div style={{ width: '35rem', height: '30rem', margin: 'auto', marginBottom: '12rem' }}>
        <h2 style={{ textAlign: 'center' }}>
          All the best for your <br /> <span style={{ color: 'purple' }}> {subject}</span> Interview!
        </h2>
        <VideoRecorder
          isOnInitially
          isFliped
          showReplayControls
          countdownTime="3000"
          timeLimit="60000"
          onRecordingComplete={(videoBlob) => {
            setIsVideoRecorded(true);
            setRecordedBlob(videoBlob);
          }}
        />
      </div>
      <div className="question">
        <h3><ReactTyped strings={[question]} typeSpeed={100} /></h3>
      </div>
      <button id="btn" onClick={handleButtonClick} disabled={submitting}>
        {submitting ? (
          <>
            <ClipLoader color="white" loading={true} size={15} />
            <span style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }}>submitting the video ...</span>
          </>
        ) : (
          'Submit'
        )}
      </button>
      <ToastContainer />
    </>
  );
}