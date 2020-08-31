import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import swal from 'sweetalert';

import { setHardwareInfo } from '../actions';
import { BASE_URL } from '../baseValues';

import Search from './Search';


class SearchPage extends Component {
    getHardwareInfo = () => {
        let { accessToken } = this.props;

        $.ajax({
            method: "GET",
            url: BASE_URL + "/api/hardware/data/misc/",
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            success: resp => {
                let result = resp.results.device_registered;

                this.props.setHardwareInfo(result);
            },
            error: function (resp) {
                console.log(resp);
                swal({
                    title: "Unable to fetch device data.",
                    // text: "Please try again.",
                    icon: "warning"
                });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="container" style={{ marginTop: '5vh', display: 'flex', justifyContent: 'center' }} >
                    <Search updateHardwareInfo={this.getHardwareInfo}/>
                </div>
                <br></br>
                <br></br>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    accessToken: state.credentials.tokens.accessToken
})

export default connect(mapStateToProps, { setHardwareInfo })(SearchPage);


