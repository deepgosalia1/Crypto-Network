import React, { Component } from 'react';
import logo from '../assets/bc.jpg';
import { Link } from 'react-router-dom';
import { welcome, welcome2, notes, steps } from '../assets/welcome'
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
                <h2>{welcome}</h2>
                <h3>{welcome2}</h3>
                <br />
                <div><Link to='/blocks'> Mined Blocks </Link></div>
                <div><Link to='/conduct-transaction'> Perform Transaction </Link></div>
                <br />
                <div><h3>Your Blockchain Wallet information</h3></div>
                <div className='WalletInfo'>
                    <div><u>Address</u> := {address}</div>
                    <div><u>Balance</u> := {balance}</div>
                </div>
                <br />
                <br />
                <h4> <b>Steps:</b>
                    {
                        steps.map(step => {
                            return (
                                <div key={step.id}>{step.id} - {step.text}</div>
                            )
                        })
                    }
                </h4>
                <br />
                <br />
                <h4> <b>Notes:</b>
                    {
                        notes.map(note => {
                            return (
                                <div key={note.id}>{note.id} - {note.text}</div>
                            )
                        })
                    }
                </h4>
            </div>

        )
    }
}

export default App;