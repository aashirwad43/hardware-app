import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import $ from 'jquery';

import { setAuthCred } from '../actions';

import AddHardware from './AddHardware';
import Search from './Search';

import { BASE_URL } from '../baseValues';

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            reduxValue:this.props.reduxValue
        }
    }

    componentDidMount() {
        this.getUserID()
    }

    refreshToken = () => {
        let { reduxValue } = this.state;

        setInterval(() => {
            $.ajax({
                method: "POST",
                url: BASE_URL + "/api/auth/token/refresh",
                data: {
                    refresh: reduxValue.tokens.refreshToken
                },
                success: (resp) => {
                    reduxValue.tokens.accessToken = `Bearer ${resp.access}`;
                    this.props.setAuthCred(reduxValue);
                }
            })
        }, 600000);
    }

    getUserID = () => {
        var { reduxValue } = this.state;
        let { accessToken } = reduxValue.tokens;
        let { username } = reduxValue.user;

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
                reduxValue.user.id = resp.results.id
                this.props.setAuthCred(reduxValue);
            },
            error: function (resp) {
                console.log(resp);
                swal({
                    title: "Unable to update your user data.",
                    // text: "Please try again.",
                    icon: "warning"
                });
            }
        });
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
    reduxValue:state.credentials
})

export default connect(mapStateToProps, { setAuthCred })(Home);