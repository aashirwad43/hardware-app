import React from 'react';
import { Navbar, Container, Dropdown } from 'react-bootstrap';

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
                <Navbar expand="lg" className="bg-dark" >
                    <Container>
                        <Navbar.Brand onClick ={ () => this.props.setMode("home") }><h3>Hardware Registration App</h3></Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <div style={{position:'absolute', right:'15rem'}}>
                                <Dropdown >
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                        { this.state.username }
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={ () => this.props.setMode("profile") }>Profile</Dropdown.Item>
                                        <Dropdown.Item onClick={ () => this.props.setMode("about") }>About</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={ this.killSession }>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
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