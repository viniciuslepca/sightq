from flask import Flask, request, abort
import analysis


app = Flask(__name__)

# Path and method
# Google.com/search -> /search = path
# Methods: GET / POST / PATCH / DELETE

# Front end sends request to server - I interpret and send response
# How to listen for these requests? Based on path and method


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
@app.route("/user/<str:uid>", methods = ["POST"])
def index():
    return


# Sign-in methods
@app.route("/sign-in", methods = ["POST"])
def index():
    return

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

@app.error_handler(404)
def not_found():
    return jsonify({
        "success": False,
        "error_code": 404,
        "message": "Not Found"
    }), 404


if (__name__ == "__main__"):
    app.run()