import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import { setAuthCred } from '../actions';
import { saveToLocalStorage } from '../localStorage';

import AddHardware from './AddHardware';
import HardwareInfo from './HardwareInfo';

import { BASE_URL, EXPIRY } from '../baseValues';
import { Row , Col} from 'react-bootstrap';

class Home extends Component {
    componentDidMount() {
        this.getUserID();
        
        setInterval(() => {
            let { expiry } = this.props.reduxValue.credentials.tokens;
            let now = Date.now();
            
            if (now >= expiry) {
                this.refreshToken();
            }
        }, (10 * 1000)); // Check every 5 minutes
    }

    refreshToken = () => {
        let reduxValue  = this.props.reduxValue;

        let data = JSON.stringify({
            refresh: reduxValue.credentials.tokens.refreshToken
        });

        $.ajax({
            method: "POST",
            url: BASE_URL + "/api/auth/token/refresh/",
            data,
            headers: {
                'Content-Type': 'application/json'
            },
            success: (resp) => {
                let expiryTime = EXPIRY()
                reduxValue.credentials.tokens.expiry = expiryTime;
                reduxValue.credentials.tokens.accessToken = `Bearer ${resp.access}`;

                saveToLocalStorage(reduxValue);

                this.props.setAuthCred(reduxValue.credentials);
            },
            error: (e) => console.log(e)
        });
    }

    getUserID = () => {
        let reduxValue = this.props.reduxValue;
        let { accessToken } = reduxValue.credentials.tokens;
        let { username } = reduxValue.credentials.user;

        let data = {
            username: username
        };

        $.ajax({
            method: "GET",
            url: BASE_URL + "/api/user/",
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            data,
            dataType: 'json',
            success: (resp) => {
                reduxValue.credentials.user.id = resp.results.id;
                this.props.setAuthCred(reduxValue.credentials);
            },
            error: (resp) => {
                console.log(resp);
                localStorage.removeItem('state');
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="container" style={{ marginTop: '5vh'}}>
                    <Row>
                        <Col sm={3} className="margin-card">
                            <HardwareInfo />
                        </Col>
                        <Col sm={9} className="margin-card">
                            <AddHardware />
                        </Col>
                    </Row>
                    {/* <div className="row">       
                        <div className="col-sm-auto margin-card">
                            <HardwareInfo />
                        </div>
                        {/* <div className="col-sm-auto margin-card" > */}
                            {/* <AddHardware /> */}
                        {/* </div>  */}
                    {/* </div> */}
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    reduxValue:state
})

export default connect(mapStateToProps, { setAuthCred })(Home);