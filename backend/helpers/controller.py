import os

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from . import analysis
import json


# Initialize this project with firebase support
# KEYS file not shared for security reasons
key_object = {
    "type": os.environ.get('TYPE'),
    "project_id": os.environ.get('PROJECT_ID'),
    "private_key_id": os.environ.get('PRIVATE_KEY_ID'),
    "private_key": os.environ.get('PRIVATE_KEY').replace('\\n', '\n'),
    "client_email": os.environ.get('CLIENT_EMAIL'),
    "client_id": os.environ.get('CLIENT_ID'),
    "auth_uri": os.environ.get('AUTH_URI'),
    "token_uri": os.environ.get('TOKEN_URI'),
    "auth_provider_x509_cert_url": os.environ.get('AUTH_PROVIDER_X509_CERT_URL'),
    "client_x509_cert_url": os.environ.get('CLIENT_X509_CERT_URL')
}

USER_ID = "cldelahan@gmail.com"

cred = credentials.Certificate(key_object)

# Initialize the app to service account
try:
    firebase_admin.initialize_app(cred, {
        'databaseURL' : 'https://sightq-d333a.firebaseio.com/'
        # https://firebase.google.com/docs/database/admin/start#python
        # ^ how to initialize with separate security rules
    })
except:
    print("Duplicate Firebase Avoided")
# get data from reference
ref = db.reference("/meetings")

def get_meetings_helper():
    result = ref.get()
    for meeting_id in result:
        mtg_data = result[meeting_id]["meeting"]
        mtg_stats = result[meeting_id]["stats"]
        mtg_json = {
            "id": mtg_data["id"],
            "title": mtg_data["topic"],
            "duration": mtg_data["duration"],
            "imageUrl": mtg_data["speaker_vid_url"],
            "scores": {
                "involvement": mtg_stats["involvement"],
                "participation_score": mtg_stats["participation_score"]
        }}
    return mtg_json


    # {id: , title: , duration: , imageUrl: , scores: {engagement: 0.92, effectiveness: 12, humor: 12, ...}}
    ###
    ###

def get_specific_meeting_helper(id):
    return
    # ^ + properties

def get_historical_field(field):
    return