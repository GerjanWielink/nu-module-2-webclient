import React, { Component } from 'react';
import moment from  "moment";
import {baseUrl} from "../../constants";
import { Grid, Card, List, Confirm, Header } from "semantic-ui-react";
import { withRouter } from "react-router";
import RemotesList from "./RemotesList";
import FilesList from "./FilesList";

class Dashboard extends Component {
    intervals =[];

    constructor(props) {
        super(props);

        this.state = {
            selectedRemote: null,
            activeConfirmationModal: null,
            remotes: [],
            myFiles: []
        }
    }


    componentDidMount() {
        this.intervals.push(setInterval(this.fetchRemotes, 2000));

        this.inspectLocalhost();
        this.fetchRemotes();
        this.fetchFiles();
    }

    componentWillUnmount() {
        this.intervals.forEach(interval => clearInterval(interval))
    }


    render () {
        const { remotes, selectedRemote, activeConfirmationModal, myFiles } = this.state;

        return (
            <React.Fragment>
                <Header as={'h1'} textAlign={'center'}>Remotes</Header>
                <RemotesList
                    remotes={remotes}
                    handleFetchFiles={this.refreshFiles}
                    handleShowDetails={this.showDetails}
                />

                {selectedRemote &&
                    <React.Fragment>
                        <Header as={'h2'} textAlign={'center'}>
                            {selectedRemote.hostname}:{selectedRemote.port}
                        </Header>
                        <Grid columns={2}>
                            <Grid.Column>
                                <Header as={'h3'} textAlign={'center'}>
                                    Downloads
                                </Header>

                                <FilesList
                                    files={selectedRemote.files}
                                    type='download'
                                    onClickFile={this.promptDownload}
                                    onConfirmModal={(filename) => this.startDownload(selectedRemote, filename)}
                                    onModalClose={this.cancelPrompt}
                                    activeConfirmationModal={activeConfirmationModal}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Header as={'h3'} textAlign={'center'}>
                                    Uploads
                                </Header>

                                <FilesList
                                    files={myFiles}
                                    type='upload'
                                    onClickFile={this.promptDownload}
                                    onConfirmModal={(filename) => this.startUpload(selectedRemote, filename)}
                                    onModalClose={this.cancelPrompt}
                                    activeConfirmationModal={activeConfirmationModal}
                                />
                            </Grid.Column>
                        </Grid>
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }

    fetchRemotes = () => {
        return fetch(baseUrl + "/remotes")
            .then(result => result.json())
            .then((remotes) => {
                this.setState({
                    remotes: Object.values(remotes)
                })
            })
            .catch(err => console.log(err));
    };

    fetchFiles = () => {
        fetch(baseUrl + "/files")
            .then(result => result.json())
            .then((myFiles) => {
                this.setState({
                  myFiles
                })
            })
    };


    promptDownload = (modalId) => {
        this.setState({
            activeConfirmationModal: modalId,
        })
    };

    cancelPrompt = () => {
        this.setState({
            activeConfirmationModal: null,
        })
    };

    startDownload = (remote, filename) => {
        fetch(`${baseUrl}/request/${remote.hostname}/${remote.port}/D${filename}`);
        this.props.history.push("/downloads");
    };

    startUpload = (remote, filename) => {
        fetch(`${baseUrl}/request/${remote.hostname}/${remote.port}/U${filename}`);
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
