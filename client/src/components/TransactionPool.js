import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Transaction from './Transaction';
import { Button } from 'react-bootstrap';
import history from '../history';
const POLL_INTERVAL = 10000;

class TransactionPool extends Component {
    state = { transactionPoolMap: {} }

    fetchTPM() {
        fetch(`${document.location.origin}/api/t_pool_map`)
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
    }

    fetchMineTransactions(){
        fetch(`${document.location.origin}/api/mine-transactions`)
        .then(response => {
            if(response.status === 200){
                alert('Success!');
                history.push('/blocks');
            } else {
                alert('Err. Unable to complete the Mining request')
            }
        })
    }

    componentDidMount() {
        this.fetchTPM();
        this.fetchInterval = setInterval(()=>this.fetchTPM(),POLL_INTERVAL)
    }

    componentWillMount(){
        clearInterval(this.fetchInterval)
    }
    
    render() {
        return (
            <div className="TransactionPool">
                <div><Link to='/'> Home </Link></div>
                <h3> Transaction in the current Block </h3>
                {
                    Object.values(this.state.transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }
                <hr/>
                <Button bsStyle="danger" onClick={this.fetchMineTransactions}> Mine this Pool! </Button>
            </div>
        )
    }
}

export default TransactionPool;