import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class ConducTransaction extends Component {

    state = {
        recipient: "",
        amount: "",
    }

    updateRecipient = event => {
        this.setState({ recipient: event.target.value });
    }

    updateAmount = event => {
        this.setState({ amount: Number(event.target.value) });
    }

    conductTransaction = () =>{
        const {recipient, amount} = this.state;
        fetch(`${document.location.origin}/api/transact`,{
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({recipient, amountToBePaid: amount})
        }).then(response => response.json()).then(json => alert(json.message || json.type))
        .then(()=>history.push('/transaction-pool'))
    }
    render() {
        return (
            <div className='ConductTransaction'>
                <Link to='/'> Home </Link>
                <h3>  Please enter these mandatory fields  </h3>
                <h3>  Conduct a Transaction  </h3>
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