import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setAuthCred } from '../actions';
// import { defaultCredState } from '../reducers';

import { Form, Button } from 'react-bootstrap';
import $ from 'jquery';
import swal from 'sweetalert';

import { BASE_URL } from '../baseValues';
import { Layout } from '../components/Layout';

import { store } from '../store';

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

    componentDidMount() {
        let { tokens } = this.state.auth;

        if (tokens.accessToken) {
            this.props.setAuth();
        }
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

        let { username } = this.state.auth.user;
        let { password } = this.state;

        let data = JSON.stringify({
            username,
            password
        })

        var component = this

        const hashedAppKey = "6117160db3031c067ae97f06a216ebb4c64f9a978956e63c75f19c824f8b59e8a92c038d2ec9e5b5c1d6ee023212b6f26a8ceb07954cec05e902d278a7b6cf1a";

        $.ajax({
            method: "POST",
            url: this.state.url,
            headers: {
                app: hashedAppKey,
                'Content-Type': 'application/json'
            },
            data,
            dataType: 'json',
            success: function (resp) {
                let { auth } = component.state;
                auth.tokens = {
                    accessToken: `Bearer ${resp.access}`,
                    refreshToken: resp.refresh
                }

                component.props.setAuthCred(component.state.auth);
                component.props.setAuth();
            },
            error: function (resp) {
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
    tokens: state.credentials.tokens
})

export default connect(mapStateToProps, { setAuthCred })(Login);

function saveToLocalStorage(state) {
    // const now = new Date();
    // let expiryTime = now.getTime() + 1200000; // 20 minutes

    try {
        // state.expiry = expiryTime;
        let serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    }
    catch (e) {
        console.log(e)
    }
}

store.subscribe(() => saveToLocalStorage(store.getState()));
// setInterval(() => localStorage.removeItem('state'), 1200000);