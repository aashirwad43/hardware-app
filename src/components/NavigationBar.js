import React from 'react';
import { Nav, Navbar, Container, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
    .navbar-brand {
        color: #ffffff;

        &:hover {
            color: #e1ebe5;
        }

       
    }

    
`;



export const NavigationBar = () => (
    <Styles>
        <Navbar expand="lg" className="bg-dark" >
            <Container>
                <Navbar.Brand href="/home"><h3>Hardware Registration App</h3></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" >
                        {/* <Nav.Item><Nav.Link  href="./about" >About</Nav.Link></Nav.Item> */}
                    </Nav>
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Aashirwad
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                            <Dropdown.Item onClick={ this.props.killSession }>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>    
        </Navbar>
    </Styles>
)