import React, { Component } from 'react';
import { connect } from 'react-redux'
import $ from 'jquery';

import { setAuthCred } from '../actions';

import AddHardware from './AddHardware';
import Search from './Search';

import { BASE_URL } from '../baseValues';

class Home extends Component {
    refreshToken = () => {
        let reduxValue = this.props.reduxValue;

        setInterval(() => {
            $.ajax({
                method: "POST",
                url: BASE_URL + "/api/auth/token/refresh",
                data: {
                    refresh: reduxValue.credentials.tokens.refreshToken
                },
                success: (resp) => {
                    reduxValue.credentials.tokens.accessToken = `Bearer ${resp.access}`;
                    this.props.setAuthCred(reduxValue);
                }
            })
        }, 600000);
    }

    render() {
        return (
            <React.Fragment>
                <div className="container" style={{ marginTop: '10vh' }}>
                    <div className="row justify-content-center">
                        <div className="col-sm-auto margin-card">
                            <AddHardware />
                        </div>
                        <div className="col-sm-auto margin-card">
                            <Search />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    reduxValue:state
})

export default connect(mapStateToProps, { setAuthCred })(Home);