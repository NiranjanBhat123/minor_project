import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useLocation } from 'react-router-dom';
import VideoRecorder from 'react-video-recorder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Record.css';
import { useRecordWebcam } from 'react-record-webcam';

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
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);

  let { cardName } = location.state;
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

  const handleButtonClick = () => {
    if (!isVideoRecorded) {
      toast.error('Record a video before submitting');
    } else {
      toast.success('Video submitted successfully!');
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
          }}
        />
      </div>
      <div className="question">
        <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, id!</h3>
      </div>
      <button id="btn" onClick={handleButtonClick}>
        Submit
      </button>
      <ToastContainer />
    </>
  );
}
