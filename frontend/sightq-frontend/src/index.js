import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'

import MeetingsPage from './meetings'

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        const pages = {
            'MEETINGS_PAGE': 'Meetings',
            'TRENDS_PAGE': 'Trends',
            'SETTINGS_PAGE': 'Settings'
        };

        this.state = {
            userName: "TEMP_USER_NAME",
            activePage: pages.MEETINGS_PAGE,
            pages: pages
        };
    }

    setActivePage = (page) => {
        this.setState({activePage: page});
    };

    renderActivePage = () => {
        switch (this.state.activePage) {
            case this.state.pages.MEETINGS_PAGE:
                return <MeetingsPage/>
            case this.state.pages.TRENDS_PAGE:
                return <p>Trends page</p>
            case this.state.pages.SETTINGS_PAGE:
                return <p>Settings page</p>
            default:
                return null
        }
    };

    render() {
        return (
            <div>
                <Header pages={this.state.pages} userName={this.state.userName} setActivePage={this.setActivePage}/>
                <div id="app-body">
                    {this.renderActivePage()}
                </div>
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