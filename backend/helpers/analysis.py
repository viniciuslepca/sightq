import os

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
    return None
