from flask import Flask, request, abort, jsonify
from flask_cors import CORS
from helpers import analysis

app = Flask(__name__)
CORS(app)

# Path and method
# Google.com/search -> /search = path
# Methods: GET / POST / PATCH / DELETE

# Front end sends request to server - I interpret and send response
# How to listen for these requests? Based on path and method

@app.route('/meetings')
def get_meetings():
    # meetings = get_meetings_helper()
    meetings = [{'id': 1}, {'id': 2}]
    return jsonify({
        'success': True,
        'meetings': meetings
    })

@app.route('/meetings/<meeting_id>')
def get_specific_meeting(meeting_id):
    # meeting = get_specific_meeeting_helper(meeting_id)
    meeting = {'id': 1}
    return jsonify({
        'success': True,
        'meeting': meeting
    })


#######################
### SIGN IN METHODS ###
#######################

@app.route("/", methods = ["GET"]) #second is method
def index():
    return str(analysis.getExampleData())
    # I return Json or HTML


#######################
### SIGN IN METHODS ###
#######################

# Sign-in methods
@app.route("/user/<uid>", methods = ["POST"])
def get_user(uid):
    return None


# Sign-in methods
@app.route("/sign-in", methods = ["POST"])
def sign_in():
    return None

# Process Recording
@app.route("/recording", methods = ["POST"])
def process_recording():
    return None

# Process Transcript
@app.route("/transcript", methods = ["POST"])
def process_transcript():
    return None


'''
Have them all return json - key is success : true


# path parameter, enforced to be an int
@app.route("/meetings/<int:meeting_id>", methods = ["GET"]) #second is method
def index(meetingid):
    abort(404)
    # I return Json or HTML
    return "TestString"

# this puts the ?=
@app.route("/meetings", methods = ["GET"]) #second is method
def index(meetingid):
    q = request.args.get("STRING_NAME")
    # I return Json or HTML
    return "TestString"


# GET requests cannot have bodies
# used for user / pass
@app.route("/meetings", methods = ["POST"]) #second is method
def index(meetingid):
    body = request.get_json()
    # I return Json or HTML
    return "TestString"

# also header parameters
'''

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error_code": 404,
        "message": "Not Found"
    }), 404

if __name__ == "__main__":
    app.run(debug=True)