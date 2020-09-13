import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {XYPlot, VerticalGridLines, HorizontalGridLines, LineSeries, XAxis, YAxis} from 'react-vis';
// Images
const thumbsUpImage = require('./images/thumbs-up.png');
const thumbsDownImage = require('./images/thumbs-down.png');

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
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
            <div id="meetings-body">
                {this.state.meetings.map(meeting => <MeetingCard key={meeting.id}
                                                                 meeting={meeting}
                                                                 setDisplayDetailedMeeting={this.setDisplayDetailedMeeting}/>)}
                <DetailedMeetingView
                    show={this.state.displayDetailedMeeting !== null}
                    id={this.state.displayDetailedMeeting}
                    baseurl={this.props.baseurl}
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
                            <Col md="auto"><Card.Img src={meeting.imageUrl} alt="Meeting"/></Col>
                            <Col>
                                <Card.Title>{meeting.title}</Card.Title>
                                {
                                    meeting.analyzed ?
                                        <div>
                                            <Card.Subtitle className="mb-2 text-muted">Duration: {meeting.duration}</Card.Subtitle>
                                            <MeetingCardStats meeting={meeting}/>
                                        </div> :
                                        null
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div style={{textAlign: "right"}}>
                                    {
                                        meeting.analyzed ?
                                            <Button onClick={() => this.props.setDisplayDetailedMeeting(meeting.id)}
                                                    variant="primary">+ Details</Button> :
                                            <Button disabled>In Analysis</Button>
                                    }
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

        return (
            <Modal
                {...this.props}
                size="xl"
                centered>
                <div style={{backgroundColor: "#f8f9fa"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.state.meeting.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6>Duration: {this.state.meeting.duration}</h6>
                        <DetailedMeetingInformation/>
                    </Modal.Body>
                </div>

            </Modal>
        );
    }
}

function DetailedMeetingInformation(props) {
    const data = [
        {x: 0, y: 8},
        {x: 1, y: 5},
        {x: 2, y: 4},
        {x: 3, y: 9},
        {x: 4, y: 1},
        {x: 5, y: 7},
        {x: 6, y: 6},
        {x: 7, y: 3},
        {x: 8, y: 2},
        {x: 9, y: 0}
    ];
    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <XYPlot height={300} width={300}>
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis />
                            <YAxis />
                            <LineSeries data={data} />
                        </XYPlot>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}