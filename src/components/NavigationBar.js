import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import styled from 'styled-components';
import { Component } from 'react';

import { store } from '../store';


const Styles = styled.div`
    .navbar-brand {
        color: #ffffff;

        &:hover {
            color: #e1ebe5;
        }
    }   


    .nav .nav-link {
        text-decoration: 'none';
        color: #ffffff;

        &:hover {
            color: #6ba2fa
        }
    }

    .nav-link:focus {
        color: #6ba2fa
    }

    
`;



class NavigationBar extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: ""
        }
    }

    componentDidMount() {
        store.subscribe(() => {
            this.setState({
                username: store.getState().credentials.user.username
            })
        });
    }

    killSession = () => {
        localStorage.removeItem('state');
        window.location.href="";
    }

    render(){
        return(
            <Styles>
                <Navbar expand="lg" className="bg-dark " >
                    <Container>
                        <Navbar.Brand onClick ={ () => this.props.setMode("home") }>Hardware Registration App</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-sm-between">
                            <Nav className="nav">
                                <Nav.Link onClick ={ () => this.props.setMode("home") } ><i className="fas fa-home"></i> Home</Nav.Link>
                                <Nav.Link onClick ={ () => this.props.setMode("search") }><i className="fas fa-search"></i> Search</Nav.Link>
                            </Nav>
                            <NavDropdown className="nav" title={this.state.username} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={ () => this.props.setMode("profile") }> Profile </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={ this.killSession }> Log Out </NavDropdown.Item>
                            </NavDropdown>
                        </Navbar.Collapse>
                    </Container>    
                </Navbar>
            </Styles>
        )
    }
}

// const mapStateToProps = state => ({
//     username:state.credentials.user.username
// })

// export default connect(mapStateToProps, {})(NavigationBar);
export default NavigationBar;