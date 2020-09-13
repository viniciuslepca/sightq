import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// Images
const thumbsUpImage = require('./images/thumbs-up.png');
const thumbsDownImage = require('./images/thumbs-down.png');

const baseUrl = "http://localhost:5000";

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
            meetings: [],
            displayDetailedMeeting: null // Hold ID of meeting to be displayed, null otherwise
        }
    }

    setDisplayDetailedMeeting = (id) => {
        this.setState({displayDetailedMeeting: id})
    };

    getMeetings = async () => {
        const url = baseUrl + "/meetings";
        const response = await fetch(url).then(response => response.json());
        if (response.success) {
            this.setState({meetings: response.meetings})
        } else {
            alert('Something went wrong when extracting meetings!')
        }
    };

    componentDidMount() {
        this.getMeetings();
    }

    render() {
        return (
            <div>
                {this.state.meetings.map(meeting => <MeetingCard key={meeting.id}
                                                                 meeting={meeting}
                                                                 setDisplayDetailedMeeting={this.setDisplayDetailedMeeting}/>)}
                <DetailedMeetingView
                    show={this.state.displayDetailedMeeting !== null}
                    id={this.state.displayDetailedMeeting}
                    onHide={() => this.setDisplayDetailedMeeting(null)}
                />
            </div>
        );
    }
}

class MeetingCard extends React.Component {
    render() {
        const meeting = this.props.meeting;
        return (
            <Card style={{marginBottom: "10px"}}>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col md="auto"><Card.Img src={meeting.imageUrl} alt="Meeting"/></Col>
                            <Col>
                                <Card.Title>{meeting.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Duration: {meeting.duration}</Card.Subtitle>
                                <MeetingCardStats meeting={meeting}/>
                                <div style={{textAlign: "right"}}>
                                    <Button onClick={() => this.props.setDisplayDetailedMeeting(meeting.id)}
                                            variant="primary">+ Details</Button>
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
        let positiveScores = [];
        let negativeScores = [];
        for (const [key, value] of Object.entries(this.props.meeting.scores)) {
            const score = {
                name: key,
                value: value
            };

            if (value >= cutOff) {
                positiveScores.push(score)
            } else {
                negativeScores.push(score)
            }
        }


        return (
            <Card.Body>
                <Container>
                    <Row>
                        <Col>
                            {positiveScores.map(score => <Property type="positive"
                                                                          key={score.name} score={score}/>)}
                        </Col>
                        <Col>
                            {negativeScores.map(score => <Property type="negative"
                                                                          key={score.name} score={score}/>)}
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        );
    }
}

function Property(props) {
    let imageRef = props.type === "positive" ? thumbsUpImage : thumbsDownImage;
    let imageAlt = props.type === "positive" ? "Positive score" : "Negative score";

    return (
        <Container>
            <Row>
                <Col md="auto"><img style={{width: "20px", height: "20px"}} src={imageRef} alt={imageAlt}/></Col>
                <Col>{titleCase(props.score.name)}: {formatPercentage(props.score.value)}</Col>
            </Row>
        </Container>
    );
}

class DetailedMeetingView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meeting: null
        }
    }

    getMeetingDetail = async () => {
        const url = baseUrl + "/meetings/" + this.props.id;
        const response = await fetch(url).then(response => response.json());
        if (response.success) {
            this.setState({meeting: response.meeting})
        } else {
            alert("Something went wrong!")
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.id !== this.props.id) {
            if (this.props.id !== null) {
                this.getMeetingDetail();
            } else {
                this.setState({meeting: null})
            }
        }
    }

    render() {
        const id = this.props.id;
        if (id === null || this.state.meeting === null) return null;

        return (
            <Modal
                {...this.props}
                size="xl"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.state.meeting.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Duration: {this.state.meeting.duration}</h6>
                    <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.
                    </p>
                </Modal.Body>
            </Modal>
        );
    }
}

export default MeetingsPage;