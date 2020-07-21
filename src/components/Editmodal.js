import React, { Component, props } from 'react';
import {Modal, Button, Row, Col, Form} from 'react-bootstrap';

export class Editmodal extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Profile Info
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>]
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default Editmodal
