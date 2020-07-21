import React, { Component } from 'react'
import { Form, Button, form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const formStyle = {

    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000'

};

export default class Login extends Component {
    constructor(props){
        super(props)
        let loggedIn = false
        this.state = {
            loggedIn
        }

        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    submitForm(e){
        e.preventDefault();
        axios.request({
            method:'post',
            url:'https://satshree.pythonanywhere.com/api/auth/token/login',
            data: {
                username: 'this.refs.username.value',
                password: 'this.refs.password.value'
            }
        }).then(response => {
            // this.props.history.push("/home");
            this.props.setToken(response.access, response.refresh);
            console.log(response);
        }).catch(err => console.log(err));
           
    }


    render() {
        if(this.state.loggedIn){
            return <Redirect to="/home" />
        }
        return(
            <div className="container-fluid" style={{marginTop: '15vh'}}>
                <div className="row justify-content-center">
                    <div className="col-10 col-sm-6 col-md-6">
                        <div className="form-container" style={formStyle}>
                            <h3 style={{textAlign: 'center'}}>LOGIN</h3>
                            <br/>
                            <form onSubmit={this.submitForm}>
                                <Form.Group controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Username" name="username" ref="username" onChange={this.onChange} />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword" >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter Password" name="password" ref="password" onChange={this.onChange} />
                                </Form.Group>
                                <Button variant="success" type="submit" className="btn-block">
                                    Login
                                </Button>
                            </form>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}

