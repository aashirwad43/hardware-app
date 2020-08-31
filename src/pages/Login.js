import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setAuthCred } from '../actions';
import { saveToLocalStorage } from '../localStorage';

import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import $ from 'jquery';

import { BASE_URL, APP_KEY, EXPIRY } from '../baseValues';
import { Layout } from '../components/Layout';

const formStyle = {

    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000'

};

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: false,
            alert: false,
            url: BASE_URL + '/api/auth/token/login/',
            auth: {
                user: {
                    username: this.props.credentials.username,
                },
                tokens: {
                    accessToken: this.props.tokens.accessToken,
                    refreshToken: this.props.tokens.refreshToken
                }
            },
            password: ""
        }


        this.submitForm = this.submitForm.bind(this)
    }

    updateUsername = (e) => {
        let { auth } = this.state;
        auth.user.username = e.target.value;

        this.setState({
            ...this.state,
            auth
        });
    }

    updatePassword = (e) => {
        let { password } = this.state;
        password = e.target.value;

        this.setState({
            ...this.state,
            password
        });
    }

    submitForm(e) {
        e.preventDefault();
        this.setState({ ...this.state, progress: true });

        let { auth, password, url } = this.state;
        let { username } = auth.user;

        let data = JSON.stringify({
            username,
            password
        })

        $.ajax({
            method: "POST",
            url,
            headers: {
                app: APP_KEY,
                'Content-Type': 'application/json'
            },
            data,
            dataType: 'json',
            success: (resp) => {
                auth.tokens = {
                    accessToken: `Bearer ${resp.access}`,
                    refreshToken: resp.refresh,
                    expiry: EXPIRY()
                }
            
                saveToLocalStorage({
                    credentials:auth
                });

                this.props.setAuthCred(auth);
                this.props.setAuth(auth);
            },
            error: (resp) => {
                console.log(resp)
                this.setState({ ...this.state, alert: true, progress: false });
            }
        })
    }

    getAlert = () => {
        let { alert } = this.state;

        if (alert) {
            // setTimeout(() => this.setState({ ...this.state, alert: false }), 5 * 1000);
            return (
                <React.Fragment>
                    <Alert key={1} variant="danger" onClose={() => this.setState({ ...this.state, alert: false })} dismissible>
                        <div className="text-center">
                            <strong>Authentication Failed!</strong>
                        </div>
                    </Alert>
                </React.Fragment>
            );
        } else {
            return null;
        }
    }

    getLoginBtnText = () => {
        let { progress } = this.state;

        if (progress) {
            return (
                <React.Fragment>
                    <div class="vertical-center" style={{ minHeight: 0 }}>
                        <Spinner animation="border" role="status" style={{ marginRight: '5px' }}>
                            <span className="sr-only">Logging</span>
                        </Spinner>
                        Logging You In ...
                    </div>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    Login
                </React.Fragment>
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                <Layout>
                    <div className="vertical-center">
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-10 col-sm-6 col-md-6">
                                    <Card className="form-container" style={formStyle}>
                                        <Card.Header>
                                            <h4 className="text-center">Hardware Registration App</h4>
                                        </Card.Header>
                                        <Card.Body>
                                            { this.getAlert() }
                                            <Form onSubmit={this.submitForm}>
                                                <Form.Group controlId="formBasicUsername">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Username" name="username" value={this.state.username} onChange={this.updateUsername} />
                                                </Form.Group>
                                                <Form.Group controlId="formBasicPassword" >
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control type="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.updatePassword} />
                                                </Form.Group>
                                                <div className="text-center">
                                                    <Button variant="outline-primary" type="submit" className="btn" disabled={ this.state.progress }>
                                                        { this.getLoginBtnText() }
                                                    </Button>
                                                </div>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => ({
    credentials: state.credentials.user,
    tokens: state.credentials.tokens,
})

export default connect(mapStateToProps, { setAuthCred })(Login);