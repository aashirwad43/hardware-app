import React, { Component, props } from 'react';
import { Form, Button, ButtonToolbar, form, Row, Col, Table, Modal, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';

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
    constructor(props){
        super(props)
        this.state= {editModalShow: false}
        this.state = {changepasswordModalShow: false}
        
    }

    componentWillMount(){
        var access;
        axios.request({
            method:'POST',
            url:'https://satshree.pythonanywhere.com/api/auth/token/login',
            data: {
                username: 'aashirwad',
                password: 'aashirwad'
            }
        }).then(response => {
            // this.props.history.push("/home");
            access = response.access;
            console.log(response);
        }).catch(err => console.log(err));
        
        axios.request({
            method:'GET',
            url:'https://satshree.pythonanywhere.com/api/user/?username=aashirwad',
            headers: {
                Authorization: `Bearer ${access}`
            }
            // data: {
            //     username: 'this.refs.username.value',
            //     password: 'this.refs.password.value'
            // }
        }).then(response => {
            console.log("response");
            console.log(response);
        }).catch(err => console.log(err));
    }



    render() {
        return (
            <div className="container-fluid" style={{marginTop: '15vh'}}>
                <div className="row justify-content-center">
                    <div className="col-10 col-sm-6 col-md-6">
                        <div className="form-container" style={formStyle}>
                            <h3 style={{textAlign: 'center'}}>Profile</h3>
                            <br/>
                            <div className="container" style={{textAlign: 'center'}}>
                                <Table responsive>
                                    <tbody>
                                        <tr>
                                            <td>First Name</td>
                                            <td>Aashirwad</td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td>Last Name</td>
                                            <td>Shrestha</td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td>Username</td>
                                            <td>aashirwad43</td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td>Email</td>
                                            <td>aashirwad43@gmail.com</td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td>Phone no</td>
                                            <td>9860136444</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                            <div style={buttonStyle}>
                                <ButtonToolbar>
                                    <Button variant="primary" style={{marginRight:'5px'}} onClick={() => this.setState({editModalShow:true})}> Edit Info </Button>
                                    <Modal
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered
                                        show={this.state.editModalShow}
                                    >
                                        <Modal.Header closeButton onClick={() => this.setState({editModalShow:false})}>
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
                                                    />
                                                </InputGroup> 
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="danger" onClick={() => this.setState({editModalShow:false})}>Close</Button>
                                            <Button variant="success" onClick={() => this.setState({editModalShow:false})}>Save Changes</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </ButtonToolbar>
                                <ButtonToolbar>
                                    <Button variant="secondary" onClick={() => this.setState({changepasswordModalShow:true})}> Change Password </Button>
                                    <Modal
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered
                                        show={this.state.changepasswordModalShow}
                                    >
                                        <Modal.Header closeButton onClick={() => this.setState({changepasswordModalShow:false})}>
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
                                                />
                                            </InputGroup>  
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="danger" onClick={() => this.setState({changepasswordModalShow:false})}>Close</Button>
                                            <Button variant="success" onClick={() => this.setState({changepasswordModalShow:false})}>Save Changes</Button>
                                        </Modal.Footer>
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

export default Profile

   



