import React, { Component } from 'react';
import Block from './Block';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Blocks extends Component {
    state = {
        blocks: [],
        paginatedId: 1,
        length: 0
    }

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks/length`)
            .then(response => response.json())
            .then(json => this.setState({ length: json }));
        this.fetchPaginatedBlocks(this.state.paginatedId)();
    }

    fetchPaginatedBlocks = paginatedId => () => {
        fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }));
    }

    render() {

        return (
            <div>
                <div><Link to='/'> Home / Wallet </Link></div>

                <div>Blocks published uptil now...</div>

                {
                    [...Array(Math.ceil(this.state.length / 5)).keys()].map(key => {
                        const paginatedId = key + 1;
                        return (
                            <span key={key} onClick={this.fetchPaginatedBlocks(paginatedId)}>
                                <Button bsSize="small" bsStyle="danger">
                                    {paginatedId}
                                </Button>{" "}
                            </span>
                        )
                    })
                }

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