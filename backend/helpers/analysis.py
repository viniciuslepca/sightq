import json
from datetime import datetime, timezone
import os
from . import zoomportal as zp

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

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

cred = credentials.Certificate(key_object)

firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://sightq-d333a.firebaseio.com/'
})

class MeetingMetric():
    def __init__(self):
        # Meeting ID
        self.meeting = ""
        # Number of times each person talked
        self.participation = []
        # How good this participation distribution this
        self.participation_score = 0
        # Number of reactions total
        self.involvement = 0.0
        # Total time talked per person
        self.engagement = []
        # How good this engagement distribution this
        self.engagement_score = 0
        # Complete silence
        self.silence = 0.0
        # Number of unanswered questions
        self.unanswered = 0
        # Duration of meeting
        self.duration = 0
        # Names of the lowest participants
        self.lowest_participants = []

    def compute_metrics(self):
        return

    def to_dict(self):
        return {
            "meeting" : self.meeting.to_dict(),
            "stats" : {
              "participation": self.participation,
              "participation_score": self.participation_score,
              "involvement": self.involvement
            }}

    def push_to_firebase(self):
        ref = db.reference("/meetings").child(self.meeting.meeting_id)
        ref.set(self.to_dict())



def get_meeting_metrics(meeting):
    # Create the meeting metric
    m = MeetingMetric()
    # Set the appropiate meeting variable
    m.meeting = meeting
    # Get all the metrics for the meeting
    m.compute_metrics()
    ### These are examples for now
    m.lowest_participants = ["Test", "Horse", "Tree"]
    m.participants = ["Taco", "Horse", "Dino", "Test", "Tree"]
    m.push_to_firebase()
    return m

'''
def get_timeline_stats(data_path):
    with open(data_path) as f:
        data = json.load(f)

    # with urllib.request.urlopen(data_path) as f:
    #     data = json.load(f.read())

    timeline = data["timeline"]
    timeline.sort(key = lambda x: x['ts'])
    n = len(timeline)

    users = []
    user_ids = set()
    for time_pt in timeline:
        for user in time_pt['users']:
            user_id = user['user_id']
            if user_id not in user_ids:
                user_ids.add(user_id)
                users.append(user)

    silence = 0.0
    talk_values = dict()
    for i in range(n - 1):
        time_now = datetime.strptime(timeline[i]['ts'], '%H:%M:%S.%f').timestamp()
        time_next = datetime.strptime(timeline[i + 1]['ts'], '%H:%M:%S.%f').timestamp()
        delta = time_next - time_now
        if len(timeline[i]['users']) == 0:
            silence += delta
        else:
            for user in timeline[i]['users']:
                user_id = user['user_id']
                if user_id not in talk_values:
                    talk_values[user_id] = 0
                talk_values[user_id] += delta

    return talk_values
'''
