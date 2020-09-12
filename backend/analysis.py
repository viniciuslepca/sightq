import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from .keyfile import key_object

# Initialize this project with firebase support
# KEYS file not shared for security reasons
cred = credentials.Certificate(key_object)

# Initialize the app to service account
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://sightq-d333a.firebaseio.com/'
    # https://firebase.google.com/docs/database/admin/start#python
    # ^ how to initialize with separate security rules
})

# get data from reference
ref = db.reference("/meetings")
ref2 = db.reference("/user")

def getExampleData():
    ref.child("atqr23").get()
    ref.child("atqr23").get()

    ref.update({"duration": 101231, "engagement" : 1243124})



def getFirstName(uid):
    json =
