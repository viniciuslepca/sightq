import io
import os

# Imports the Google Cloud client library
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types
from google.cloud import storage
from google.oauth2 import service_account
from pydub import AudioSegment
import textstat

file_name = "GMT20200912-155128_Conner-Del.m4a"

def get_transcript(file, file_name):

    bucket_name = "hophacks2020"
    file_name_wav = file_name.replace(".m4a", ".wav")

    audio = AudioSegment.from_file(file)
    mem_file = io.BytesIO()
    audio.export(mem_file, 'wav')
    mem_file.seek(0)

    storage_client = storage.Client.from_service_account_json('hophacks_creds.json')

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name_wav)

    with mem_file as audio_file:
        blob.upload_from_file(audio_file)

    uri = 'gs://' + bucket_name + '/' + file_name_wav

    credentials = service_account.Credentials.from_service_account_file('hophacks_creds.json')
    speech_client = speech.SpeechClient(credentials = credentials)

    audio = types.RecognitionAudio(uri=uri)
    config = types.RecognitionConfig(
        encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=32000,
        language_code='en-US')

    # Detects speech in the audio file
    operation = speech_client.long_running_recognize(config, audio)
    print('Waiting for operation to complete...')
    response = operation.result(timeout=90)

    output = ""
    for result in response.results:
        output += result.alternatives[0].transcript + "."

    return output

def get_text_score(transcript):
    return textstat.flesch_kincaid_grade(transcript)

with open(file_name, "rb") as f:
    trans = get_transcript(f, file_name)
    print(get_text_score(trans))
