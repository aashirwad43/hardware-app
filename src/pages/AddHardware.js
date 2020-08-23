import React, { Component } from 'react'
import { Form, Button, InputGroup, Card } from 'react-bootstrap';
import $ from 'jquery';
import { connect } from 'react-redux';

import { BASE_URL } from '../baseValues'
import hardwareRegister from "../assets/images/hardware-register.PNG";
import swal from 'sweetalert';

import loading from '../assets/images/loading.gif';

const cardStyle = {
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000',
    width: '30rem'

};

// const containerStyle = {
//     display: 'flex',
//     justifyContent: 'center',
// }

const photoStyle = {
    height: '250px',
    width: '400px',
}

// const imageContainer = {
//     display: 'flex',
//     justifyContent: 'center',
// }

const buttonContainer = {
    display: 'flex',
    justifyContent: 'center',
}

export class AddHardware extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prodNumber: ''
        }
    }

    updateProductionNumber = (e) => {
        this.setState({ ...this.state, prodNumber: e.target.value });
    }

    registerHardware = (e) => {
        e.preventDefault();

        let accessToken = this.props.accessToken;
        let { prodNumber } = this.state

        if (prodNumber) {
            let data = JSON.stringify({
                production_number: prodNumber
            });

            $.ajax({
                method: "POST",
                url: BASE_URL + "/api/hardware/",
                headers: {
                    Authorization: accessToken,
                    'Content-Type': 'application/json'
                },
                xhr: function () {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function () {
                        swal({
                            icon:loading
                        });
                    }, false);

                    return xhr;
                },
                data,
                dataType: 'json',
                success: (resp) => {
                    let icon;

                    if (resp.status) {
                        icon = "success";
                    } else {
                        icon = "warning";
                    }

                    swal({
                        title: resp.message,
                        icon
                    })
                    // .then(() => this.setState({ ...this.state, prodNumber: '' }));
                },
                error: (resp) => {
                    console.log(resp);
                    swal({
                        text: resp.responseJSON.message,
                        icon: "error"
                    })
                }
            });
        } else {
            swal({
                title: "Please Enter Production Number.",
                icon: "warning"
            })
        }
    }

    verifyDevice = (e) => {
        e.preventDefault();

        let accessToken = this.props.accessToken;
        let { prodNumber } = this.state;

        if (prodNumber) {
            let data = JSON.stringify({
                production_number: prodNumber
            });

            $.ajax({
                method: "POST",
                url: BASE_URL + "/api/hardware/verify/device/",
                headers: {
                    Authorization: accessToken,
                    'Content-Type': 'application/json'
                },
                xhr: function () {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function () {
                        swal({
                            icon:loading
                        });
                    }, false);

                    return xhr;
                },
                data,
                dataType: 'json',
                success: (resp) => {
                    if (resp.status === true){
                        swal({
                            title: "Device exists.",
                            icon: "success"
                        })
                        // .then(() => this.setState({ ...this.state, prodNumber: '' }));
                    }
                    
                },
                error: (resp) => {
                    console.log(resp);
                    swal({
                        title: resp.status === 404 ? resp.responseJSON.message : undefined,
                        text: resp.status === 404 ? undefined : resp.responseJSON.message,
                        icon: "error"
                    })
                    // .then(() => this.setState({ ...this.state, prodNumber: '' }));
                }
            });
        } else {
            swal({
                title: "Please Enter Production Number.",
                icon: "warning"
            })
        }

    }

    render() {
        return (
            <React.Fragment>
                <Card style={cardStyle}>
                    <h3 style={{ textAlign: 'center' }}>Register Hardware</h3>
                    <br />
                    <Card.Img src={hardwareRegister} style={photoStyle} />
                    <br />
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Production Number</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                placeholder="Enter Production Number"
                                type="number"
                                onChange={this.updateProductionNumber}
                                value={this.state.prodNumber}
                                required
                            />
                        </InputGroup>
                        <div className="container" style={buttonContainer}>
                            <Button variant="info" onClick={this.registerHardware}>Register Now</Button>
                            <Button variant="outline-info" style={{marginLeft: "10px"}} onClick={this.verifyDevice}>Verify Device</Button>
                        </div>
                    </Form>
                </Card>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    accessToken: state.credentials.tokens.accessToken
})

export default connect(mapStateToProps, {})(AddHardware);
