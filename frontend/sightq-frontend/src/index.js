import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'

import MeetingsPage from './meetings';
import TrendsPage from "./trends";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-vis/dist/style.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        const pages = {
            'MEETINGS_PAGE': 'Meetings',
            'TRENDS_PAGE': 'Trends'
       };

        this.state = {
            userName: "Conner Delahanty",
            activePage: pages.MEETINGS_PAGE,
            pages: pages,
            baseUrl: "http://localhost:5000"
        };
    }

    // Based on https://stackoverflow.com/questions/37096367/how-to-convert-seconds-to-minutes-and-hours-in-javascript
    secondsToHms = d => {
        d = Number(d);
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 3600 % 60);

        const hDisplay = h > 0 ? h + " h, " : "";
        const mDisplay = m > 0 ? m + " min, " : "";
        const sDisplay = s > 0 ? s + " s" : "";
        return hDisplay + mDisplay + sDisplay;
    };

    setActivePage = (page) => {
        this.setState({activePage: page});
    };

    renderActivePage = () => {
        switch (this.state.activePage) {
            case this.state.pages.MEETINGS_PAGE:
                return <MeetingsPage baseurl={this.state.baseUrl} secondsconverter={this.secondsToHms}/>;
            case this.state.pages.TRENDS_PAGE:
                return <TrendsPage baseurl={this.state.baseUrl} secondsconverter={this.secondsToHms}/>;
            default:
                return null
        }
    };

    render() {
        return (
            <div>
                <Header pages={this.state.pages} userName={this.state.userName} setActivePage={this.setActivePage}/>
                {this.renderActivePage()}
            </div>
        );
    }
}

function Header(props) {
    return (
        <Navbar bg="light" variant="light">
            <Navbar.Brand href="#home">SightQ</Navbar.Brand>
            <Nav className="mr-auto" defaultActiveKey={props.pages.MEETINGS_PAGE}
                 onSelect={(selectedKey) => props.setActivePage(selectedKey)}>
                {Object.keys(props.pages).map(pageName => {
                    const page = props.pages[pageName];
                    return <Nav.Link key={page} eventKey={page}>{page}</Nav.Link>
                })}
            </Nav>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as: <a href="#login">{props.userName}</a>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);