import React, { Component } from 'react';
import moment from  "moment";
import {baseUrl} from "../../constants";
import { Grid, Card, List, Confirm } from "semantic-ui-react";
import { withRouter } from "react-router";

class Dashboard extends Component {
    intervals =[];

    constructor(props) {
        super(props);

        this.state = {
            remotes: [],
            selectedRemote: null,
            showConfirmModal: null,
        }
    }


    componentDidMount() {
        this.intervals.push(setInterval(this.fetchRemotes, 2000));

        this.inspectLocalhost();
        this.fetchRemotes();
    }

    componentWillUnmount() {
        this.intervals.forEach(interval => clearInterval(interval))
    }


    render () {
        const { remotes, selectedRemote, showConfirmModal } = this.state;

        return (
            <Grid columns={2} divided>
                <Grid.Column>
                    <Card>
                        <Card.Content>
                            <Card.Header style={{ marginBottom: '1em'}}>
                                Remotes
                            </Card.Header>
                            <Card.Content>
                                <List divided relaxed>
                                    {remotes.map(remote => (
                                        <List.Item key={remote.hostname}>
                                            <List.Icon name='server' size='large' verticalAlign='middle' onClick={() => this.refreshFiles(remote)} />
                                            <List.Content>
                                                <List.Header as='a' onClick={() => this.showDetails(remote)}>{`${remote.hostname}:${remote.port}`}</List.Header>
                                                <List.Description>Last seen: {moment.unix(remote.lastseen).format("HH:mm")}</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    ))}
                                </List>
                            </Card.Content>
                        </Card.Content>
                    </Card>
                </Grid.Column>

                <Grid.Column>
                    {selectedRemote != null && (
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    {selectedRemote.hostname}
                                </Card.Header>
                                <Card.Content>
                                    {selectedRemote.files.map(file => (
                                        <React.Fragment key={file.filename}>
                                            <List.Item>
                                                <List.Icon name='file' size='large' verticalAlign='middle' />
                                                <List.Content>
                                                    <List.Header as='a' onClick={() => this.promptDownload(file.filename)}>{file.filename}</List.Header>
                                                    <List.Description>{file.size} bytes</List.Description>
                                                </List.Content>
                                            </List.Item>

                                            {/* Confirmation modal*/}
                                            <Confirm
                                                open={showConfirmModal === file.filename}
                                                onCancel={this.cancelPrompt}
                                                onConfirm={() => this.startDownload(selectedRemote, file.filename)}
                                            />
                                        </React.Fragment>
                                    ))}
                                </Card.Content>
                            </Card.Content>
                        </Card>
                    )}
                </Grid.Column>
            </Grid>
        );
    }

    fetchRemotes = () => {
        fetch(baseUrl + "/remotes")
            .then(result => result.json())
            .then((remotes) => {
                this.setState({
                    remotes: Object.values(remotes)
                })
            })
            .catch(err => console.log(err));
    };


    promptDownload = (filename) => {
        this.setState({
            showConfirmModal: filename,
        })
    };

    cancelPrompt = () => {
        this.setState({
            showConfirmModal: null,
        })
    };

    startDownload = (remote, filename) => {
        fetch(`${baseUrl}/request/${remote.hostname}/${remote.port}/D${filename}`);
        this.props.history.push("/downloads");
    };

    refreshFiles = (remote) => {
        fetch(`${baseUrl}/request/${remote.hostname}/${remote.port}/I`)
    };

    showDetails = (remote) => {
        this.setState({
            selectedRemote: remote,
        });
    };

    inspectLocalhost = () => {
        fetch(`${baseUrl}/request/127.0.0.1/16666/I`)
    };
}


export default withRouter(Dashboard);
