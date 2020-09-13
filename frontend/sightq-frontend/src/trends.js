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
            meetings: []
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
        if (this.state.meetings.length < 3) {
            return <div style={{textAlign: "center"}}>
                <h5>Please record at least 3 meetings so we can display trends.</h5>
            </div>
        }
        return <Trends/>
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
                    <Col md="auto">
                        <Card style={{backgroundColor: "#f8f9fa"}}>
                            <Card.Body>
                                <Card.Title>Title</Card.Title>
                                <XYPlot height={300} width={300}>
                                    <VerticalGridLines />
                                    <HorizontalGridLines />
                                    <XAxis />
                                    <YAxis />
                                    <LineSeries data={data} />
                                </XYPlot>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}