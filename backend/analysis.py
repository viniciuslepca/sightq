import tempfile
import json

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from .keyfile import key_object

# Initialize this project with firebase support
# KEYS file not shared for security reasons
f = tempfile.TemporaryFile()
f.write(bytes(json.dumps(key_object), 'utf-8'))
cred = credentials.Certificate(f)
f.close()

# Initialize the app to service account
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://sightq-d333a.firebaseio.com/'
    # https://firebase.google.com/docs/database/admin/start#python
    # ^ how to initialize with separate security rules
})

# get data from reference
ref = db.reference("/user")

def getExampleData():
    return ref.get()
