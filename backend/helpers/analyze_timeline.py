import json
from datetime import datetime, timezone

with open("backend/data.json") as f:
    data = json.load(f)


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

print(talk_values)





# for point in changes:
#     print(point)