import React, { Component } from 'react';
import { Card, CardImg } from 'react-bootstrap';
import CountUp from 'react-countup';
import today2 from '../assets/images/today2.png';
import today from '../assets/images/today.png';
import alltime from '../assets/images/alltime.png';

import {connect} from 'react-redux';
import { BASE_URL } from '../baseValues';
import $ from 'jquery';
import swal from 'sweetalert';



const cardStyle = {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000',
    width: '20rem',
    height: '10.70rem'
};

const photoStyle = {
    width: '70px'
}

const imageDivStyle = {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '6px'
}

export class HardwareInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allTime: 0,
            byMeToday: 0,
            byMeAllTime: 0 
        }
    }

    componentDidMount() {
        let accessToken = this.props.accessToken;

        var component = this;

        $.ajax({
            method: "GET",
            url: BASE_URL + "/api/hardware/data/misc/",
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            success: function (resp) {
                component.setState({ ...component.state, allTime: resp.results.device_registered.all_time, byMeToday: resp.results.device_registered.by_you.today, byMeAllTime: resp.results.device_registered.by_you.all_time });
            },
            error: function (resp) {
                console.log(resp);
                swal({
                    title: "Unable to fetch device data.",
                    text: "Please try again.",
                    icon: "warning"
                });
            }
        });
    };


    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="col">
                        <div className="row-sm-auto margin-card">
                            <Card style={cardStyle}>
                                <div style={imageDivStyle}>
                                    <CardImg src={today2} style={photoStyle}></CardImg>
                                </div>
                                <h3 style={{textAlign: 'center'}}><CountUp end={this.state.allTime}/></h3>
                                <h6 style={{textAlign: 'center'}}>Total Devices Registered</h6>
                            </Card>
                        </div>
                        <div className="row-sm-auto margin-card">
                            <Card style={cardStyle}>
                                <div style={imageDivStyle}>
                                    <CardImg src={today} style={photoStyle}></CardImg>
                                </div>
                                <h3 style={{textAlign: 'center'}}><CountUp end={this.state.byMeToday}/></h3>
                                <h6 style={{textAlign: 'center'}}>Devices Registered by me today</h6>
                            </Card>
                        </div>
                        <div className="row-sm-auto margin-card">
                            <Card style={cardStyle}>
                                <div style={imageDivStyle}>
                                    <CardImg src={alltime} style={photoStyle}></CardImg>
                                </div>
                                <h3 style={{textAlign: 'center'}}><CountUp end={this.state.byMeAllTime}/></h3>
                                <h6 style={{textAlign: 'center'}}>Registered by me all time</h6>
                            </Card>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    accessToken: state.credentials.tokens.accessToken
})

export default connect(mapStateToProps, {})(HardwareInfo);
