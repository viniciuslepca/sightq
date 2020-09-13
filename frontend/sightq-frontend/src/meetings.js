import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {XYPlot, LineSeries, YAxis} from 'react-vis';
// Images
const thumbsUpImage = require('./images/thumbs-up.png');
const thumbsDownImage = require('./images/thumbs-down.png');

function titleCase(str) {
    return str.toLowerCase().replace('_', ' ').split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

function formatPercentage(number) {
    return (number * 100).toFixed(0) + "%";
}

export default class MeetingsPage extends React.Component {
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
        const url = this.props.baseurl + "/meetings";
        const response = await fetch(url).then(response => response.json());
        if (response.success) {
            this.setState({meetings: response.meetings});
        } else {
            alert('Something went wrong when extracting meetings!')
        }
    };

    componentDidMount() {
        this.getMeetings();
    }

    render() {
        return (
            <div id="meetings-body">
                {this.state.meetings.map(meeting => <MeetingCard key={meeting.id}
                                                                 meeting={meeting}
                                                                 secondsconverter={this.props.secondsconverter}
                                                                 setDisplayDetailedMeeting={this.setDisplayDetailedMeeting}/>)}
                <DetailedMeetingView
                    show={this.state.displayDetailedMeeting !== null}
                    id={this.state.displayDetailedMeeting}
                    baseurl={this.props.baseurl}
                    secondsconverter={this.props.secondsconverter}
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
            <Card style={{marginBottom: "10px", backgroundColor: "#f8f9fa"}}>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col md="auto">
                                <video width="320" height="240" controls>
                                    <source src={meeting.imageUrl}/>
                                </video>
                            </Col>
                            <Col>
                                <Card.Title>{meeting.title}</Card.Title>
                                <div>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Duration: {this.props.secondsconverter(meeting.duration)}
                                    </Card.Subtitle>
                                    <MeetingCardStats meeting={meeting}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
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
                {positiveScores.map(score => <Property type="positive"
                                                       key={score.name} score={score}/>)}
                {negativeScores.map(score => <Property type="negative"
                                                       key={score.name} score={score}/>)}
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
                <Col style={{textAlign: "left"}}>{titleCase(props.score.name)}: {formatPercentage(props.score.value)}</Col>
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
        const url = this.props.baseurl + "/meetings/" + this.props.id;
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

        const meeting = this.state.meeting;
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="xl"
                centered>
                <div style={{backgroundColor: "#f8f9fa"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {meeting.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col>
                                    <div style={{textAlign: "center"}}>
                                        <h6>General Information</h6>
                                    </div>
                                    Meeting Date/Time: {meeting.start_time}<br/>
                                    Duration: {this.props.secondsconverter(meeting.duration)}<br/>
                                    Participants: {meeting.participants.join(", ")}<br/>
                                    Least Active Participants: {meeting.properties.lowest_participants.join(", ")}<br/>
                                </Col>
                                <Col>
                                    <div style={{textAlign: "center"}}>
                                        <h6>Scores</h6>
                                        <MeetingCardStats meeting={this.state.meeting}/>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <DetailedMeetingPlots meeting={this.state.meeting}/>
                            </Row>
                        </Container>
                    </Modal.Body>
                </div>

            </Modal>
        );
    }
}

function DetailedMeetingPlots(props) {
    const engagement = props.meeting.properties.engagement;
    let data = [];
    for (let i = 0; i < engagement.length; i++) {
        data.push({
            x: i,
            y: (100 * Number(engagement[i])).toFixed(2)
        })
    }
    return (
        <Container>
            <Row>
                <Col md="auto">
                    <Card>
                        <div style={{textAlign: "center"}}>
                            <h6>Distribution of participation (%)</h6>
                        </div>
                        <XYPlot title="test" height={300} width={300}>
                            <YAxis/>
                            <LineSeries data={data}/>
                        </XYPlot>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}