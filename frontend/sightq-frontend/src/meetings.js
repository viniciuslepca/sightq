import React from 'react';
import Card from 'react-bootstrap/Card'

const someMeeting = {
    title: "This is the title",
    runTime: "1h 14min",
    imageUrl: "https://via.placeholder.com/150",
    properties: {
        engagement: 0.92,
        effectiveness: 0.3,
        humor: 0.6
    }
};

class MeetingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meetings: [someMeeting]
        }
    }

    getMeetings = () => {
        // Some API Call to get meeting data
        // Update state with meeting objects
    };

    render() {
        return this.state.meetings.map(meeting => <MeetingCard meeting={meeting}/>);
    }
}

class MeetingCard extends React.Component {
    render() {
        return (
            <Card>
                test
            </Card>
        )
    }
}

export default MeetingsPage;