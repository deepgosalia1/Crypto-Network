console.log('aaya')
import React from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import {render} from 'react-dom';
import App from './components/App';
import history from './history';
import './index.css';
import Blocks from './components/Blocks';
import ConducTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';


render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/blocks' component={Blocks}/>
            <Route path='/conduct-transaction' component={ConducTransaction}/>
            <Route path='/transaction-pool' component={TransactionPool}/>
        </Switch>
    </Router>,
    document.getElementById("root")
);
