import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
// import axios from 'axios';
import $ from 'jquery';


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
            url:'https://satshree.pythonanywhere.com/api/auth/token/login/',
            username:"",
            password:"",
            loggedIn
        }


        this.submitForm = this.submitForm.bind(this)
    }

    updateUsername = (e) => {
        this.setState({
            ...this.state,
            username: e.target.value
        })
    }

    updatePassword = (e) => {
        this.setState({
            ...this.state,
            password: e.target.value
        })
    }

    submitForm(e){
        e.preventDefault();

        let { username } = this.state
        let { password } = this.state

        let cred = {
            username,
            password
        }

        var component = this

        $.ajax({
            method:"POST",
            url:this.state.url,
            headers: {
                'Content-Type': 'application/json'
            },
            data:JSON.stringify(cred),
            dataType:'json',
            success: function(resp) {
                // console.log("success")
                // console.log(resp)
                component.props.setToken(resp.access, resp.refresh)
            },
            error: function(resp) {
                console.log("err")
                console.log(resp)
                window.alert(resp)
            }
        })           
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
                                    <Form.Control type="text" placeholder="Enter Username" name="username" value={ this.state.username } onChange={ this.updateUsername } />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword" >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter Password" name="password" value={ this.state.password }  onChange={ this.updatePassword } />
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

