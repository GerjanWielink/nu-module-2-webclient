import React from "react";
import {Segment, Icon, Message} from "semantic-ui-react";
import FormattedSize from "../../components/FormattedSize";
import moment from "moment";

const DownloadsList = ({downloads, showInspections, showCompleted, onPause}) => (
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
                        name={getIcon(download.requestType)}
                        style={{ color: download.finReceived ? "green" : "inherit"}}
                        loading={!download.finReceived}
                    />
                    <Message>
                        <Message.Header>{download.requestPayload} @ {download.destinationHost}:{download.destinationPort}</Message.Header>
                        <FormattedSize bytes={download.bytesRead}/> received <br/>
                        <FormattedDownloadSpeed download={download} />
                    </Message>
                    {!download.finReceived && <Icon name={download.paused ? "play" : "pause"} onClick={() => onPause(download)}/>}
                </Segment>
            ))}
    </Segment.Group>
);

const getIcon = (requestType) => {
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

const FormattedDownloadSpeed = ({ download: {transactionStartTime, transactionEndTime, bytesRead}}) => {
    const startTime = moment(transactionStartTime);
    const endTime = transactionEndTime !== -1 ? moment(transactionEndTime) : moment();

    const duration = moment.duration(endTime.diff(startTime));
    const elapsedSeconds = duration.asSeconds();

    const bytesPerSecond = bytesRead / elapsedSeconds;

    return (
        <React.Fragment>
            <FormattedSize bytes={bytesPerSecond} />/s
        </React.Fragment>
    )
};

export default DownloadsList;