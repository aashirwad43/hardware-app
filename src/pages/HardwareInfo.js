import React, { Component } from 'react';
import { Card, CardImg, Row, Col } from 'react-bootstrap';
import {connect} from 'react-redux';

import CountUp from 'react-countup';
import today2 from '../assets/images/today2.png';
import today from '../assets/images/today.png';
import alltime from '../assets/images/alltime.png';
import total from '../assets/images/total.png';

const cardStyle = {
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000',
    // width: '20rem',
    // height: '12.30rem'
};

const photoStyle = {
    width: '70px',
    paddingTop: '10px'
}

const imageDivStyle = {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '6px'
}

export class HardwareInfo extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <Row>
                        <Col sm={13} className="margin-card">
                            <Card style={cardStyle}>
                                <Row>
                                    <Col>
                                        <div style={imageDivStyle}>
                                            <CardImg src={total} style={photoStyle}></CardImg>
                                        </div>
                                    </Col>
                                    <Col>
                                        <h3 style={{textAlign: 'center'}}><CountUp end={this.props.info.all_time}/></h3>
                                        <h6 style={{textAlign: 'center'}}>Total Devices Registered</h6>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col sm={13} className="margin-card">
                            <Card style={cardStyle}>
                                <Row>
                                    <Col>
                                        <div style={imageDivStyle}>
                                            <CardImg src={today2} style={photoStyle}></CardImg>
                                        </div>
                                    </Col>
                                    <Col>
                                        <h3 style={{textAlign: 'center'}}><CountUp end={this.props.info.today}/></h3>
                                        <h6 style={{textAlign: 'center'}}>Total Devices Registered Today</h6>
                                    </Col>
                                </Row>
                            </Card> 
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={13} className="margin-card">
                            <Card style={cardStyle}>
                                <Row>
                                    <Col>
                                        <div style={imageDivStyle}>
                                            <CardImg src={alltime} style={photoStyle}></CardImg>
                                        </div>
                                    </Col>
                                    <Col>
                                        <h3 style={{textAlign: 'center'}}><CountUp end={this.props.info.by_you.all_time}/></h3>
                                        <h6 style={{textAlign: 'center'}}>Total Devices You Registered </h6>
                                    </Col>
                                </Row>
                            </Card> 
                        </Col>
                        <Col sm={13} className="margin-card">
                            <Card style={cardStyle}>
                                <Row> 
                                    <Col>
                                        <div style={imageDivStyle}>
                                            <CardImg src={today} style={photoStyle}></CardImg>
                                        </div>
                                    </Col>
                                    <Col>
                                        <h3 style={{textAlign: 'center'}}><CountUp end={this.props.info.by_you.today}/></h3>
                                        <h6 style={{textAlign: 'center'}}>Devices You Registered Today</h6>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>  
                    </Row>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    info: state.hardwareInfo
})

export default connect(mapStateToProps, {})(HardwareInfo);
