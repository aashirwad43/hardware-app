import React, { Component } from 'react';
import Search from './Search';


class SearchPage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="container" style={{ marginTop: '5vh', display: 'flex', justifyContent: 'center' }} >
                    <Search />
                </div>
                <br></br>
                <br></br>
            </React.Fragment>
        )
    }
}

export default SearchPage;


