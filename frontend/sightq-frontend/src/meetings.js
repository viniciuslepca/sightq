import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
// Images
const thumbsUpImage = require('./images/thumbs-up.png');
const thumbsDownImage = require('./images/thumbs-down.png');


const someMeeting = {
    id: 1,
    title: "Lecture 8/2/20 - Genomics II",
    runTime: "1h 14min",
    imageUrl: "https://via.placeholder.com/300X150",
    properties: {
        engagement: 0.92,
        effectiveness: 0.3,
        humor: 0.6
    }
};

const otherMeeting = {
    id: 1,
    title: "Lecture 7/31/20 - Genomics I",
    runTime: "49min",
    imageUrl: "https://via.placeholder.com/300X150",
    properties: {
        engagement: 0.97,
        effectiveness: 0.89,
        humor: 0.35
    }
};

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

function formatPercentage(number) {
    return (number * 100).toFixed(0) + "%";
}

class MeetingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meetings: [someMeeting, otherMeeting]
        }
    }

    getMeetings = () => {
        // Some API Call to get meeting data
        // Update state with meeting objects
    };

    render() {
        return this.state.meetings.map(meeting => <MeetingCard key={Math.random()} meeting={meeting}/>);
    }
}

class MeetingCard extends React.Component {
    render() {
        return (
            <Card style={{marginBottom: "10px"}}>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col md="auto"><Card.Img src={this.props.meeting.imageUrl} alt="Meeting"/></Col>
                            <Col>
                                <Card.Title>{this.props.meeting.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Runtime: {this.props.meeting.runTime}</Card.Subtitle>
                                <MeetingCardStats meeting={this.props.meeting}/>
                                {/*<Card.Link href="#">+ More</Card.Link>*/}
                                <div style={{textAlign: "right"}}>
                                    <Button variant="primary">+ Details</Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        )
    }
}

class MeetingCardStats extends React.Component {
    render() {
        const cutOff = 0.7;
        let positiveProperties = [];
        let negativeProperties = [];
        for (const [key, value] of Object.entries(this.props.meeting.properties)) {
            const property = {
                name: key,
                value: value
            };

            if (value >= cutOff) {
                positiveProperties.push(property)
            } else {
                negativeProperties.push(property)
            }
        }


        return (
            <Card.Body>
                <Container>
                    <Row>
                        <Col>
                            {positiveProperties.map(property => <Property type="positive"
                                                                          key={property.name} property={property}/>)}
                        </Col>
                        <Col>
                            {negativeProperties.map(property => <Property type="negative"
                                                                          key={property.name} property={property}/>)}
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        );
    }
}

function Property(props) {
    let imageRef = props.type === "positive" ? thumbsUpImage : thumbsDownImage;
    let imageAlt = props.type === "positive" ? "Positive property" : "Negative property";

    return (
        <Container>
            <Row>
                <Col md="auto"><img style={{width: "20px", height: "20px"}} src={imageRef} alt={imageAlt}/></Col>
                <Col>{titleCase(props.property.name)}: {formatPercentage(props.property.value)}</Col>
            </Row>
        </Container>
    )

}

export default MeetingsPage;