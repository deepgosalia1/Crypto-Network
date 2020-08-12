import React, { Component } from 'react';
import logo from '../assets/bc.jpg';
import { Link } from 'react-router-dom';

class App extends Component {
    state = {
        walletInfo: {}
    }

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }));
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return (

            <div className='App'>
                <img src={logo} className='logo' />
                <br /><br />
                <div>Your Blockchain Wallet information</div>
                <div><Link to='/blocks'> Mined Blocks </Link></div>
                <div><Link to='/conduct-transaction'> Perform Transaction </Link></div>
                <div className='WalletInfo'>
                    <div>Address {address}</div>
                    <div>Balance {balance}</div>

                </div>
            </div>

        )
    }
}

export default App;