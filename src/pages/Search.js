import React, { Component } from 'react'
import { Button, InputGroup, Form, Card, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';

import $ from 'jquery';

import { BASE_URL } from '../baseValues'
import searching from "../assets/images/searching.png";

const cardStyle = {
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000',
    width: '30rem'

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

export class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productionNumber: "",
            accessToken: this.props.access,
            searchDeviceList: []
        }
    }

    updateProductNumber = (e) => {
        this.setState({ ...this.state, productionNumber: e.target.value })
    }

    getHardware = (e) => {
        e.preventDefault();

        let { searchDeviceList, accessToken, productionNumber } = this.state;

        let data = JSON.stringify({
            search: productionNumber
        });

        var component = this;

        $.ajax({
            method: "GET",
            url: BASE_URL + "/api/hardware/",
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            processData:false,
            data,
            dataType: 'json',
            success: function (resp) {
                component.setState({...component.state, searchDeviceList:resp.results});
            }, 
            error: function(resp) {
                console.log(resp)
                swal({
                    title:"Something went wrong.",
                    text:"Please try again.",
                    icon:"warning"
                });
            }
        });

    }

    getCardOrTable = () => {
        let { searchDeviceList } = this.state;
        let dataExists;

        if (Array.isArray(searchDeviceList)) {
            dataExists = searchDeviceList.length === 0;
        } else {
            dataExists = Object.keys(searchDeviceList).length === 0 && searchDeviceList.constructor === Object;
        }

        if (dataExists) {
            return (
                <React.Fragment>
                    <Card.Img src={searching} style={{ height: '289px', width: '400px' }} />
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Table responsive>
                        <tbody>
                            <tr>
                                <td>Device Id</td>
                                <td>{this.state.searchDeviceList.device_id}</td>
                            </tr>
                            <tr>
                                <td>Production Number</td>
                                <td>{this.state.searchDeviceList.production_number}</td>
                            </tr>
                            <tr>
                                <td>Registered By</td>
                                <td>{this.state.searchDeviceList.registered_by.username}</td>
                            </tr>
                            <tr>
                                <td>Registered On</td>
                                <td>{this.state.searchDeviceList.registered_on}</td>
                            </tr>
                        </tbody>
                    </Table>
                </React.Fragment>
            )
        }
    }

    render() {
        if (this.state.searchDeviceList === null) {

        }
        return (
            <React.Fragment>
                <Card style={cardStyle}>
                    <h3 style={{ textAlign: 'center' }}>Search Hardware</h3>
                    <br />
                    <Form onSubmit={this.getHardware}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Production number"
                                aria-label="Production Number"
                                aria-describedby="basic-addon1"
                                type="number"
                                onChange={this.updateProductNumber}
                                value={this.state.productionNumber}
                            />
                            <InputGroup.Prepend>
                                <Button variant="success" type="submit">Search</Button>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Form>
                    <br />
                    {this.getCardOrTable()}
                </Card>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    access: state.credentials.tokens.accessToken
})

export default connect(mapStateToProps, {})(Search);
