import React, { Component } from 'react';
import Block from './Block';
import { Link } from 'react-router-dom';

class Blocks extends Component {
    state = {
        blocks: []
    }

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks`)
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }));
    }

    render() {

        return (
            <div>
                <div><Link to='/'> Home / Wallet </Link></div>

                <div>Blocks published uptil now...</div>
                <div>{this.state.blocks.map(
                    block => {
                        return (
                            <Block key={block.hash} block={block} />
                        )
                    }
                )}</div>
            </div>
        )
    }
}

export default Blocks;