import json
from datetime import datetime as dt, timezone
import os
import io
import zoomportal as zp
import numpy as np

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import speech_to_text as stt
import requests

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
        self.participation = 0
        # How good this participation distribution this
        self.participation_score = 0
        # Number of reactions total
        self.involvement = 0.0
        # Total time talked per person
        self.engagement = [""]
        # How good this engagement distribution this
        self.engagement_score = 0
        # Complexity of the conversation and length of conversation
        self.complexity = 0
        # Complete silence
        self.silence = 0.0
        # Number of unanswered questions
        self.unanswered = 0
        # Names of the lowest participants
        self.lowest_participants = [""]

    def to_dict(self):
        return {
            "meeting" : self.meeting.to_dict(),
            "stats" : {
              "participation": self.participation,
              "participation_score": self.participation_score,
              "involvement": self.involvement,
              "engagement": self.engagement,
              "engagement_score": self.engagement_score,
              "silence": self.silence,
              "unanswered": self.unanswered,
              "lowest_participants": self.lowest_participants,
              "complexity" : self.complexity
            }}

    def transcribe_and_analyze(self):
        r = requests.get(self.meeting.audio_url)
        #print(r)
        f = io.BytesIO(r.content)
        with f as file:
            transcript = stt.get_transcript(file)
            self.complexity = stt.get_text_score(transcript)



    def generate_all_metrics(self):
        users, times = self.get_parallel_arrays(self.meeting.recording_json)
        sum_dict = self.get_sum_dict(users, times)
        self.engagement = self.get_engagement(sum_dict)
        self.involvement = 0
        self.participation = self.get_participation(users)
        self.silence = self.get_silence(sum_dict)
        self.unanswered = self.get_unanswered(users, times)
        self.lowest_participants = self.get_lowest_participants(sum_dict)

        self.engagement_score = self.get_engagement_score()
        self.participation_score = self.get_participation_score()

    def get_participation_score(self):
        a = self.participation  / (4 * (self.meeting.n_participants * self.meeting.duration / 60) ** (1.0 / 2))
        if (a > 1):
            return 1
        if (a < 0):
            return 0
        return a

    def get_engagement_score(self):
        eng = np.asarray(self.engagement)
        avg = np.average(eng)
        return float((eng[eng - (0.5) * avg > 0]) / len(self.engagement))


    def get_lowest_participants(self, sum_dict):
        time = []
        users = []
        for val in sum_dict:
            d = list(val.values())[0]
            u = list(val.keys())[0]
            if (u == "BLANK KEY"):
                continue
            time.append(d)
            users.append(list(val.keys())[0])

        z = [x for _,x in sorted(zip(time,users))]
        if (len(z) >= 3):
            return [z[0], z[1], z[2]]
        else:
            return z[0]


    def get_unanswered(self, users, times):
        time_diff = times[1:] - times[:-1]
        users = users[:-1]
        return int(np.sum(users[time_diff>10] == "BLANK KEY"))

    def get_silence(self, sum_dict):
        return float((sum_dict[0])["BLANK KEY"])

    def get_participation(self, users):
        return len(users)

    def get_engagement(self, sum_dict):
        engagement = []
        for val in sum_dict:
            d = list(val.values())[0]
            engagement.append(d)
        # add a 0 for each person not counted
        for i in range (0, self.meeting.n_participants - len(engagement)):
            engagement.append(0)
        return engagement

    def get_sum_dict(self, users, times):
        total_time = times[-1]
        sum_times = times[1:] - times[:-1]
        unique_users = np.unique(users)
        users = users[:-1]
        user_sum = []
        for i in unique_users:
            mask = users == i
            sum = np.sum(sum_times[mask]) / total_time
            user_sum.append({i: sum})
        return user_sum


    def get_parallel_arrays(self, data_path):
        with open(data_path) as f:
            data = json.load(f)
        timeline = data["timeline"]
        timeline.sort(key = lambda x: x['ts'])

        user_sum = []
        all_times = []
        users = []
        for object in timeline:
            t = dt.strptime(object['ts'], '%H:%M:%S.%f').time()
            all_times.append(t.hour * 3600 + t.minute * 60 + t.second)
            if (len(object["users"]) == 0):
                users.append("BLANK KEY")
            else:
                users.append(((object["users"])[0])["username"])

        times = np.array(all_times)
        users = np.array(users)

        return (users, times)

    def push_to_firebase(self):
        ref = db.reference("/meetings").child(self.meeting.meeting_id.replace("/", "_"))
        ref.set(self.to_dict())


def get_meeting_metrics(meeting):
    # Create the meeting metric
    m = MeetingMetric()
    # Set the appropiate meeting variable
    m.meeting = meeting
    # Get all the metrics for the meeting

    m.transcribe_and_analyze()

    m.generate_all_metrics()
    ### These are examples for now
    m.push_to_firebase()
    return m


def regenerate_all_meetings():
    mtgs = zp.get_all_meetings()
    for m in mtgs:
        get_meeting_metrics(m)