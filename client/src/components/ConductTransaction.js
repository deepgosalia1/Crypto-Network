import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class ConducTransaction extends Component {

    state = {
        recipient: "",
        amount: "",
        knownAddresses: []
    }

    componentDidMount() {
        fetch(`${document.location.origin}/api/known-addresses`)
            .then(response => response.json()).then(json => this.setState({ knownAddresses: json }));
    }

    updateRecipient = event => {
        this.setState({ recipient: event.target.value });
    }

    updateAmount = event => {
        this.setState({ amount: Number(event.target.value) });
    }

    conductTransaction = () => {
        const { recipient, amount } = this.state;
        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, amountToBePaid: amount })
        }).then(response => response.json()).then(json => alert(json.message || json.type))
            .then(() => history.push('/transaction-pool'))
    }
    render() {
        return (
            <div className='ConductTransaction'>
                <Link to='/'> Home </Link>
                <h3>  Please enter these mandatory fields  </h3>
                <h3>  Conduct a Transaction using these known addresses or you own new ones! </h3>
                <br />
                <h4>Known Addresses in the system uptil now are:</h4>
                {
                    this.state.knownAddresses.map(
                        knownAddress => {
                            return (
                                <div key={knownAddress}>
                                    <div> {knownAddress} </div>
                                    <br />
                                </div>
                            )
                        }
                    )
                }
                <br />
                <FormGroup>
                    <FormControl
                        input='text'
                        placeholder='recipient'
                        value={this.state.recipient}
                        onChange={this.updateRecipient}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        type="numeric"
                        placeholder='amount'
                        value={this.state.amount}
                        onChange={this.updateAmount}
                    />
                </FormGroup>
                <div>
                    <Button bsStyle="danger" onClick={this.conductTransaction}> Send </Button>
                </div>
            </div>
        )
    }
}

export default ConducTransaction;