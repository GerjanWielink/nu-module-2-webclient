import React, {Component} from 'react';
import {baseUrl} from "../../constants";
import {Checkbox, Header, Container, Segment, Icon, Message} from "semantic-ui-react";
import moment from 'moment';

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
                    <Segment.Group>
                        {downloads
                            .filter(download => (
                                download.requestType !== "INSPECT" | showInspections
                            ))
                            .filter(download => (
                                showCompleted | !download.finReceived
                            ))
                            .map(download => (
                          <Segment key={download.id}>
                              <Icon
                                  name={download.sendingSide ? "arrow right" : "arrow left"}
                              />
                              <Icon
                                  name={this.getIcon(download.requestType)}
                                  style={{ color: download.finReceived ? "green" : "inherit"}}
                                  loading={!download.finReceived}
                              />
                              <Message>
                                  <Message.Header>{download.requestPayload} @ {download.destinationHost}:{download.destinationPort}</Message.Header>
                                  {`${Math.floor(download.bytesRead / 1000)} kB received`} <br/>
                                  {this.formattedDownloadSpeed(download)}
                              </Message>
                          </Segment>
                        ))}
                    </Segment.Group>
                </Container>
            </React.Fragment>
        )
    }

    toggleInspections = () => {
        this.setState(state => ({
            showInspections: !state.showInspections,
        }))
    };

    getIcon = (requestType) => {
        switch (requestType) {
            case "DOWNLOAD":
                return "download";

            case "UPLOAD":
                return "upload";

            case "INSPECT":
                return "info";

            default:
                return "question";
        }
    };

    formattedDownloadSpeed = ({ transactionStartTime, transactionEndTime, bytesRead}) => {
        const startTime = moment(transactionStartTime);
        const endTime = transactionEndTime !== -1 ? moment(transactionEndTime) : moment();

        const duration = moment.duration(endTime.diff(startTime));
        const elapsedSeconds = duration.asSeconds();

        const mbps = ((bytesRead) / 1000000) / elapsedSeconds;

        return `${mbps.toFixed(2)} MB/s, total time: ${elapsedSeconds.toFixed(0)} seconds`;
    };

    toggleCompleted = () => {
        this.setState(state => ({
            showCompleted: !state.showCompleted,
        }))
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
