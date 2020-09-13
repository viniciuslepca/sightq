# SightQ: A better way to meet

## Our mission: 
**SightQ incorporates more data analytics for Zoom meetings to enable meeting hosts to conduct better meetings, whether that be by improving engagement, adapting presentation styles, or decreasing wasted time.**

## Built with:
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

## How it works
SightQ leverages a linked Zoom sign-in along with custom data analysis in creating a web portal for instructors to view analysis. This will provide insight into effectiveness of meetings, as well as giving suggestions for future improvement.

## How we built it
SightQ listens on an authenticated user's Zoom cloud for newly posted recordings. Data from these recordings are read with a webhook and pushed to a python (flask) server. Data are then colsolidated, using sampling, statistical, and machine learning technologies (Google Cloud) for gain insights such as meeting quality (read through Google Cloud NLP transcription), audience participation (through dialog and length), awkward delays, and distribution of speaking. These are all consolidated, read by the React front-end and beautifully displayed on the front end, and shipped to Heroku for deployment. 

## What's next for SightQ?
- gathering survey data to create new metrics
- gathering trial data to refine mathematical models


## Link for SightQ!

http://ac7d9b22f8ff.ngrok.io/


