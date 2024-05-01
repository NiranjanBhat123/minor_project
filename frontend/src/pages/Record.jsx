import { useReactMediaRecorder } from "react-media-recorder";
import VideoRecorder from "react-video-recorder";
import {
  useRecordWebcam,
} from "react-record-webcam";
const OPTIONS = {
  filename: "test-filename",
  fileType: "mp4",
  width: 1920,
  height: 1080
};
const RecordView = () => {
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl
  } = useReactMediaRecorder({
    video: true,
    facingMode: { exact: "environment" }
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
  const recordWebcam = useRecordWebcam(OPTIONS);
  const getRecordingFileHooks = async () => {
    const blob = await recordWebcam.getRecording();
    console.log({ blob });
  };

  const getRecordingFileRenderProp = async (blob) => {
    console.log({ blob });
  };
  return (
    <div style={{width:"35rem",height:"30rem",margin:"auto"}}>
      <h1>answer the question</h1>
      <VideoRecorder
        isOnInitially
        isFliped
        showReplayControls
        countdownTime="3000"
        timeLimit="60000"
        onRecordingComplete={(videoBlob) => {
          console.log("videoBlob", videoBlob);
        }}
      />
    </div>
  );
}
