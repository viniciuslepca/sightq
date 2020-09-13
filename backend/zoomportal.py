import requests
import http.client
import json
import time


class Meeting():
    def __init__(self):
        self.meeting_id = ""
        self.duration = ""
        self.start_time = ""

        self.gallery_vid_url = ""
        self.speaker_vid_url = ""
        self.recording_json = ""


        self.already_analyzed = False


    def _str_to_time(self, t):
        y = int(t[0:4])
        mo = int(t[5:7])
        d = int(t[8:10])

        h = int(t[11:13])
        m = int(t[14:16])
        s = int(t[17:19])

        return dt.datetime(year = y, month = mo, day = d, hour = h, minute = m, second = s)

    def create_meeting_from_JSON(self, data):
        self.meeting_id = data["uuid"]
        self.start_time = self._str_to_time(data["start_time"])

        rec_data_tot = data["recording_files"]
        n_rec_files = len(rec_data_tot)

        for i in range(n_rec_files):
            rec_json = rec_data_tot[i]
            if (rec_json["recording_type"] == "active_speaker"):
                self.speaker_vid_url = rec_json["download_url"]
                end = self._str_to_time(rec_json["recording_end"]).timestamp()
                start = self._str_to_time(rec_json["recording_start"]).timestamp()
                self.duration = end - start
            if (rec_json["recording_type"] == "gallery_view"):
                self.gallery_vid_url = rec_json["download_url"]
                end = self._str_to_time(rec_json["recording_end"]).timestamp()
                start = self._str_to_time(rec_json["recording_start"]).timestamp()
                self.duration = end - start
            self.recording_json = self.meeting_id + ".json"
        return

    def to_json(self):
        return json.dumps(self.__dict__)


def _get_jwt():
     with open ('jwt.json') as f:
         jwt = json.load(f)
     return jwt["jwt"]


def get_n_meetings(data):
    return data["total_records"]


def get_all_meetings():
    # Perform HTML request to get data JSON object
    jwt = _get_jwt()
    conn = http.client.HTTPSConnection("api.zoom.us", timeout=1000)
    headers = {
       'authorization': "Bearer " + jwt,
        'content-type': "application/json"
        }
    conn.request("GET", f"/v2/users/me/recordings", headers = headers)
    res = conn.getresponse()
    data = res.read()
    data = json.loads(data.decode("UTF-8"))

    # With data JSON object, extract different artifacts
    #print(data)
    print()
    mtgs = []
    n_meetings = get_n_meetings(data)
    for i in range (n_meetings):
        mtg_json = data["meetings"][i]
        m = Meeting()
        m.create_meeting_from_JSON(mtg_json)
        mtgs.append(m)

    return mtgs