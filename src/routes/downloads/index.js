import React, {Component} from 'react';
import {baseUrl} from "../../constants";
import {Checkbox, Header, Container, Segment, Icon, Message} from "semantic-ui-react";
import moment from 'moment';
import DownloadsList from "./DownloadsList";

export default class Downloads extends Component {
    intervals = [];

    constructor (props) {
        super(props);

        this.state = {
            downloads: [],
            selectedDownload: {},
            showInspections: false,
            showCompleted: true,
        }
    }

    componentDidMount() {
        this.intervals.push(setInterval(this.fetchDownloads, 1000));
    }

    componentWillUnmount() {
        this.intervals.forEach(interval => clearInterval(interval));
    }

    render () {
        const { downloads, showInspections, showCompleted } = this.state;

        console.log(downloads);

        return (
            <React.Fragment>
                <Header as='h1' textAlign='center'>
                    Downloads
                </Header>

                <Header as='h3'>
                    Outbound requests
                </Header>

                <Container style={{ marginBottom: '1em' }}>
                    <Checkbox
                        toggle
                        label="Inspections"
                        value={showInspections ? 1 : 0}
                        style={{ marginRight: '1em' }}
                        onChange={this.toggleInspections}
                    />
                    <Checkbox
                        toggle
                        label="Completed"
                        value={showCompleted ? 1 : 0}
                        onChange={this.toggleCompleted}
                    />
                </Container>

                <Container>
                    <DownloadsList downloads={downloads} showInspections={showInspections} showCompleted={showCompleted} onPause={this.pauseDownload} />
                </Container>
            </React.Fragment>
        )
    }

    toggleInspections = () => {
        this.setState(state => ({
            showInspections: !state.showInspections,
        }))
    };

    toggleCompleted = () => {
        this.setState(state => ({
            showCompleted: !state.showCompleted,
        }))
    };

    pauseDownload = (download) => {
        fetch(`${baseUrl}/pause/${download.id}`);
    };

    fetchDownloads = () => {
        fetch(baseUrl + "/outbound")
            .then(result => result.json())
            .then((downloads) => {
                this.setState({
                    downloads: Object.keys(downloads).map(key => ({
                        id: key,
                        ...downloads[key]
                    }))
                });
            })
    }
}
