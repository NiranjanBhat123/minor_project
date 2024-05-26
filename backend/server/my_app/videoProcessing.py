import tempfile
import moviepy.editor as mp
import speech_recognition as sr


def extract_text_from_video(video_path):
    video = mp.VideoFileClip(video_path)
    audio = video.audio
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        audio.write_audiofile(f.name, codec='pcm_s16le')
        recognizer = sr.Recognizer()

        with sr.AudioFile(f.name) as source:
            audio_data = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio_data)
        return text
    except sr.UnknownValueError:
        print("Could not understand audio")
        return "candidate failed to answer the question"
    except sr.RequestError as e:
        print(f"Error: {e}")
        return "some error"
