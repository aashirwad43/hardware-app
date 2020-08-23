import React, { Component } from 'react';
import { Form, Button, ButtonToolbar, Table, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setAuthCred } from '../actions';
import { BASE_URL } from '../baseValues';
import $ from 'jquery';
import swal from 'sweetalert';

import loading from '../assets/images/loading.gif';

const formStyle = {

    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000',

};

const buttonStyle = {

    display: 'flex',
    justifyContent: 'center'

};



export class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editModalShow: false,
            changepasswordModalShow: false,
            userInfo: {},
            password: {
                newPassword: '',
                confirmNewPassword: ''
            }
        }

    }

    componentDidMount() {
        let accessToken = this.props.credentials.tokens.accessToken;

        let username = this.props.credentials.user.username;

        let data = {
            username
        };

        var component = this;

        $.ajax({
            method: "GET",
            url: BASE_URL + "/api/user/",
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            data,
            dataType: 'json',
            success: function (resp) {
                component.setState({ ...component.state, userInfo: resp.results });
            },
            error: function (resp) {
                console.log(resp);
                swal({
                    title: "Unable to fetch your user data.",
                    text: "Please try again.",
                    icon: "warning"
                });
            }
        });
    }

    newFirstName = (e) => {
        let { userInfo } = this.state;
        userInfo.first_name = e.target.value
        this.setState({ ...this.state, userInfo });
    }

    newLastName = (e) => {
        let { userInfo } = this.state;
        userInfo.last_name = e.target.value
        this.setState({ ...this.state, userInfo });
    }

    newEmail = (e) => {
        let { userInfo } = this.state;
        userInfo.email = e.target.value
        this.setState({ ...this.state, userInfo });
    }

    newUsername = (e) => {
        let { userInfo } = this.state;
        userInfo.username = e.target.value
        this.setState({ ...this.state, userInfo });
    }

    newPhone = (e) => {
        let { userInfo } = this.state;
        userInfo.phone = e.target.value
        this.setState({ ...this.state, userInfo });
    }

    updateUserInfo = (e) => {
        e.preventDefault();

        let accessToken = this.props.credentials.tokens.accessToken;
        let { userInfo } = this.state;
        let id = userInfo.id;
        let data = JSON.stringify(userInfo);
        let reduxValue = this.props.credentials;

        $.ajax({
            method: "PUT",
            url: BASE_URL + `/api/user/${id}`,
            xhr:function() {
                let xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function () {
                    swal({
                        icon:loading
                    });
                }, false);

                return xhr;
            },
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            data,
            dataType: 'json',
            success: (resp) => {
                reduxValue.user.username = resp.results.username;
                this.props.setAuthCred(reduxValue);

                swal({
                    title: "User Information Updated Successfully.",
                    icon: "success"
                })
            },
            error: (resp) => {
                console.log(resp);
                swal({
                    title: "Something went wrong",
                    text: "Please try again",
                    icon: "warning"
                })
            }
        });
    }

    updatedNewPassword = (e) => {
        let { password } = this.state;
        password.newPassword = e.target.value
        this.setState({ ...this.state, password })
    }

    updatedConfirmNewPassword = (e) => {
        let { password } = this.state;
        password.confirmNewPassword = e.target.value
        this.setState({ ...this.state, password })
    }



    updateUserPassword = (e) => {
        e.preventDefault();

        let accessToken = this.props.credentials.tokens.accessToken;
        let { password, userInfo } = this.state;
        let confirmNewPassword = password.confirmNewPassword;
        let newPassword = password.newPassword;
        let id = userInfo.id;
        
        let data = JSON.stringify({
            password: confirmNewPassword
        });

        if (newPassword === confirmNewPassword) {
            $.ajax({
                method: "PUT",
                url: BASE_URL + `/api/user/password/${id}`,
                headers: {
                    Authorization: accessToken,
                    'Content-Type': 'application/json'
                },
                data,
                dataType: 'json',
                success: (resp) => {
                    swal({
                        title: "Password Changed Successfully.",
                        icon: "success"
                    }).then(() => this.setState({ ...this.state, password: [] }));
                },
                error: (resp) => {
                    console.log(resp);
                    swal({
                        title: "Something went wrong.",
                        text: "Please try again",
                        icon: "warning"
                    })
                }
            })
        }
        else {
            swal({
                title: "Password Update Error!",
                text: "New password must be different from old password and New password and Confirm New Password must match.",
                icon: "warning"
            }).then(() => this.setState({ ...this.state, password: [] }));
        }




    }


    render() {
        return (
            <div className="container-fluid" style={{ marginTop: '15vh' }}>
                <div className="row justify-content-center">
                    <div className="col-10 col-sm-6 col-md-6">
                        <div className="form-container" style={formStyle}>
                            <h3 style={{ textAlign: 'center' }}>Profile</h3>
                            <br />
                            <div className="container" style={{ textAlign: 'center' }}>
                                <Table responsive>
                                    <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td>{this.state.userInfo.first_name} {this.state.userInfo.last_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Username</td>
                                            <td>{this.state.userInfo.username}</td>
                                        </tr>
                                        <tr>
                                            <td>Email</td>
                                            <td>{this.state.userInfo.email}</td>
                                        </tr>
                                        <tr>
                                            <td>Phone no</td>
                                            <td>{this.state.userInfo.phone}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                            <div style={buttonStyle}>
                                <ButtonToolbar>
                                    <Button variant="primary" style={{ marginRight: '5px' }} onClick={() => this.setState({ editModalShow: true })}> Edit Info </Button>
                                    <Modal
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered
                                        show={this.state.editModalShow}
                                    >
                                        <Form onSubmit={this.updateUserInfo}>
                                            <Modal.Header closeButton onClick={() => this.setState({ editModalShow: false })}>
                                                <Modal.Title id="contained-modal-title-vcenter">
                                                    Edit Profile Info
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="basic-addon1">First Name</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            placeholder="Enter First Name"
                                                            aria-label="First Name"
                                                            aria-describedby="basic-addon1"
                                                            required
                                                            type="text"
                                                            value={this.state.userInfo.first_name}
                                                            onChange={this.newFirstName}
                                                        />
                                                    </InputGroup>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="basic-addon1">Last Name</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            placeholder="Enter Last Name"
                                                            aria-label="Last Name"
                                                            aria-describedby="basic-addon1"
                                                            required
                                                            type="text"
                                                            value={this.state.userInfo.last_name}
                                                            onChange={this.newLastName}
                                                        />
                                                    </InputGroup>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            placeholder="Enter Username"
                                                            aria-label="Username"
                                                            aria-describedby="basic-addon1"
                                                            required
                                                            type="text"
                                                            value={this.state.userInfo.username}
                                                            onChange={this.newUsername}
                                                        />
                                                    </InputGroup>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            placeholder="Enter Email Address"
                                                            aria-label="Email"
                                                            aria-describedby="basic-addon1"
                                                            required
                                                            type="email"
                                                            value={this.state.userInfo.email}
                                                            onChange={this.newEmail}
                                                        />
                                                    </InputGroup>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="basic-addon1">Phone no</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            placeholder="Enter Phone Number"
                                                            aria-label="Phone no"
                                                            aria-describedby="basic-addon1"
                                                            required
                                                            type="number"
                                                            value={this.state.userInfo.phone}
                                                            onChange={this.newPhone}
                                                        />
                                                    </InputGroup>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="danger" onClick={() => this.setState({ editModalShow: false })}>Close</Button>
                                                <Button variant="success" type="submit" onClick={() => this.setState({ editModalShow: false })}>Save Changes</Button>
                                            </Modal.Footer>
                                        </Form>
                                    </Modal>
                                </ButtonToolbar>
                                <ButtonToolbar>
                                    <Button variant="secondary" onClick={() => this.setState({ changepasswordModalShow: true })}> Change Password </Button>
                                    <Modal
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered
                                        show={this.state.changepasswordModalShow}
                                    >
                                        <Form onSubmit={this.updateUserPassword}>
                                            <Modal.Header closeButton onClick={() => this.setState({ changepasswordModalShow: false })}>
                                                <Modal.Title id="contained-modal-title-vcenter">
                                                    Change Password
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text id="basic-addon1">Old Password</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl
                                                        placeholder="Enter Old Password"
                                                        aria-label="Old Password"
                                                        aria-describedby="basic-addon1"
                                                        type="password"
                                                        required
                                                        value={this.state.password.oldPassword}
                                                        onChange={this.updatedOldPassword}

                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text id="basic-addon1">New Password</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl
                                                        placeholder="Enter New Password"
                                                        aria-label="New Password"
                                                        aria-describedby="basic-addon1"
                                                        type="password"
                                                        required
                                                        value={this.state.password.newPassword}
                                                        onChange={this.updatedNewPassword}
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text id="basic-addon1">Confirm Password</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl
                                                        placeholder="Re-enter New Password"
                                                        aria-label="Confirm Password"
                                                        aria-describedby="basic-addon1"
                                                        type="password"
                                                        required
                                                        value={this.state.password.confirmNewPassword}
                                                        onChange={this.updatedConfirmNewPassword}
                                                    />
                                                </InputGroup>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="danger" onClick={() => this.setState({ changepasswordModalShow: false })}>Close</Button>
                                                <Button variant="success" type="submit" onClick={() => this.setState({ changepasswordModalShow: false })}>Save Changes</Button>
                                            </Modal.Footer>
                                        </Form>
                                    </Modal>
                                </ButtonToolbar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    credentials:state.credentials
})



export default connect(mapStateToProps, { setAuthCred })(Profile);





