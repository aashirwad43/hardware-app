import React, { Component } from 'react'
// import { Redirect } from 'react-router-dom'
import { Image, Button, Tooltip, OverlayTrigger, InputGroup, FormControl } from 'react-bootstrap';
import $ from 'jquery';
// import { Link } from 'react-router-dom';

import { BASE_URL } from '../baseValues'

import hardwareRegister from "../assets/images/hardware-register.PNG";
import searching from "../assets/images/searching.png";

const formStyle = {
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000'

};

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
}

const photoStyle = {
    height: '250px',
    width: '400px',
}

const imageContainer = {
    display: 'flex',
    justifyContent: 'center',
}

const buttonContainer = {
    display: 'flex',
    justifyContent: 'center',
}


export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken:this.props.creds.access,
            prodNumber:'',
            searchDeviceList:[]
        }

        // const token = localStorage.getItem("token")

        // let loggedIn = true
        // if(token == null){
        //     loggedIn = false
        // }

        // this.state = {
        //     loggedIn
        // }
    }


    // onChange(e){
    //     this.setState({
    //         [e.target.name]: e.target.value
    //     })
    // }

    // onSubmit(e){
    //     axios.request({
    //         method:'post',
    //         url:'https://satshree.pythonanywhere.com/api/hardware/',
    //         data: {
    //             productionnumber: 'this.refs.productionnumber.value'
    //         }
    //     }).then(response => {
    //         this.props.history.push("/home");
    //     }).catch(err => console.log(err));
    //     e.preventDefault();
    // }
    
    updateProductionNumber = (e) => {
        this.setState({...this.state, prodNumber:e.target.value});
    }

    registerHardware = (e) => {
        e.preventDefault();

        let { prodNumber, accessToken } = this.state

        let data = JSON.stringify({
            production_number:prodNumber
        });

        $.ajax({
            method:"POST",
            url:BASE_URL + "/api/hardware/",
            headers:{
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            data,
            dataType:'json',
            success: (resp) => {
                window.alert(resp.message);
                console.log(resp);
            },
            error: (resp) => {
                window.alert(resp.message);
                console.log(resp);
            }
        });
    }

    render() {
        return(
            <React.Fragment>
                <div className="container" style={containerStyle}>
                    <div className="container-fluid" style={{marginTop: '15vh'}}>
                        <div>
                            <div className="form-container" style={formStyle}>
                                <h3 style={{textAlign: 'center'}}>Register Hardware</h3>
                                <br/>
                                <div className="container" style={imageContainer}>
                                    <Image src={hardwareRegister} rounded style={photoStyle}  />
                                </div>
                                <br/>
                                <form onSubmit={this.registerHardware}>
                                    <div>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="basic-addon1">Production Number</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                placeholder="Enter Production Number"
                                                type="number"
                                                onChange={this.updateProductionNumber}
                                                value={this.state.prodNumber}
                                            />
                                        </InputGroup> 
                                    </div>
                                    <div className="container" style={buttonContainer}>
                                        <Button variant="success" type="submit" >Register Now</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="container-fluid" style={{marginTop: '15vh'}}>
                        <div>
                            <div className="form-container" style={formStyle}>
                                <h3 style={{textAlign: 'center'}}>Search Hardware</h3>
                                <br/>
                                <div>
                                   <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder="Production number"
                                            aria-label="Production Number"
                                            aria-describedby="basic-addon1"
                                        />
                                        <InputGroup.Prepend>
                                            <Button variant="success">Search</Button> 
                                        </InputGroup.Prepend>
                                        
                                    </InputGroup> 
                                </div>
                                <br/>
                                <div className="container" style={imageContainer}>
                                    <Image src={searching} rounded style={{height:'290px', width:'400px'}} />
                                </div>                            
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
    

