import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setAuthCred } from '../actions';
import { saveToLocalStorage } from '../localStorage';

import { Form, Button } from 'react-bootstrap';
import $ from 'jquery';
import swal from 'sweetalert';

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
                swal({
                    title: "Authentication failed",
                    icon: "error"
                });
            }
        })
    }

    

    render() {
        return (
            <React.Fragment>
                <Layout>
                    <div className="vertical-center">
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-10 col-sm-6 col-md-6">
                                    <div className="form-container" style={formStyle}>
                                        <h3 style={{ textAlign: 'center' }}>LOGIN</h3>
                                        <br />
                                        <form onSubmit={this.submitForm}>
                                            <Form.Group controlId="formBasicUsername">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control type="text" placeholder="Enter Username" name="username" value={this.state.username} onChange={this.updateUsername} />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword" >
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.updatePassword} />
                                            </Form.Group>
                                            <Button variant="success" type="submit" className="btn-block">
                                                Login
                                            </Button>
                                        </form>

                                    </div>
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