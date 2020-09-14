# SightQ: A better way to meet

## Our inspiration and mission: 
There's no denying Covid-19 has ushered in an era of working from home whose effects will be felt for a long time. Virtual meeting software has quickly become the norm, and Zoom has established itself as an leading platform for online communication. Academia is one of these communities forced to drastically adapt, and we hope to provide more insight to allow them to continue to improve their methods of teaching. **_SightQ incorporates more data analytics for Zoom meetings to enable meeting hosts to conduct better meetings, whether that be by improving engagement, adapting presentation styles, or decreasing wasted time._**

## How SightQ works
SightQ leverages a linked Zoom sign-in along with custom data analysis in creating a web portal for zoom hosts to view analysis. This will provide insight into effectiveness of meetings, as well as giving suggestions for future improvement.

## How we built SightQ
The technical aspect was based on how SightQ listens on an authenticated user's Zoom cloud for newly posted recordings. Data from these recordings are read with a webhook and pushed to a python (flask) server. Data are then colsolidated, using sampling, statistical, and machine learning technologies (Google Cloud) for gain insights such as meeting quality (read through Google Cloud NLP transcription), audience participation (through dialog and length), awkward delays, and distribution of speaking. These are all consolidated, read by the React front-end and beautifully displayed on the front end, and shipped to Heroku for deployment. In addition, the logistic aspect to determine modeled metrics was based on Google Forms surveys, then analyzing the CSV files on Jupyter Notebook. 

## Built with
- Python
- Flask
- Firebase
- Zoom API
- HTML
- CSS
- JavaScript
- React
- React-Vis
- React-Bootstrap
- Heroku
- Google Cloud
- Jupyter Notebook

## What's next for SightQ?
- gathering survey data to create new metrics
- gathering trial data to refine mathematical models
- further develop our frontend visualization (allow them to authenticate using their Zoom account for cybersecurity purposes)

## What does SightQ look like?
### Main Page
List of all hosted Zoom meetings.
![Main Page- List of all Zoom meetings hosted](/SightQ_MainPage.png) <br> <br>

### Meeting Analytics Page
Found by clicking on any of the hosted meetings. These include specific metrics calculated from the meeting.
![Meeting Analysis- Metrics calculated from the Zoom meeting](/SightQ_MeetingAnalysis.png) <br> <br>

### Trends Page
Depicts the metrics' changes over time from each meeting.
![Trends Page- depicts metrics' changes over time from various meetings](/SightQ_TrendsPage.png)

## Check out SightQ yourself!
http://ac7d9b22f8ff.ngrok.io/


