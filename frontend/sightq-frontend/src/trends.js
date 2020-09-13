import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {XYPlot, VerticalGridLines, HorizontalGridLines, LineSeries, XAxis, YAxis} from 'react-vis';

export default class TrendsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meetings: [],
            scores: ["participation_score", "engagement_score", "silence"],
            properties: ["participation, engagement, unanswered"]
        }
    }

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

    renderTrendsBody = () => {
        if (this.state.meetings.length < 2) {
            return <div style={{textAlign: "center"}}>
                <h5>Please record at least 2 meetings so we can display trends.</h5>
            </div>
        }
        return <Trends baseurl={this.props.baseurl} titlecase={this.props.titlecase}
                       scores={this.state.scores} properties={this.state.properties}/>
    };

    render() {
        return (
            <div id="trends-body">
                {this.renderTrendsBody()}
            </div>
        );
    }
}

class Trends extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    {this.props.scores.map(score => <TrendPlot baseurl={this.props.baseurl} key={score}
                                                               titlecase={this.props.titlecase} score={score}/>)}
                </Row>
            </Container>
        );
    }
}

class TrendPlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    getDataFromServer = async () => {
        const url = this.props.baseurl + "/trends/" + this.props.score;
        const response = await fetch(url).then(response => response.json());
        this.setState({data: response.trends})
    };


    componentDidMount() {
        this.getDataFromServer();
    }

    render() {
        if (this.state.data === null) return null;

        let data = [];
        for (let i in this.state.data) {
            data.push({
                x: i,
                y: this.state.data[i].value
            })
        }

        return (
            <Col md="auto">
                <Card style={{backgroundColor: "#f8f9fa", margin: "10px"}}>
                    <Card.Body>
                        <Card.Title>{this.props.titlecase(this.props.score)}</Card.Title>
                        <XYPlot height={250} width={250}>
                            <VerticalGridLines/>
                            <HorizontalGridLines/>
                            <XAxis/>
                            <YAxis/>
                            <LineSeries data={data}/>
                        </XYPlot>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}