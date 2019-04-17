import React from "react";
import {Segment, Icon, Message} from "semantic-ui-react";
import moment from "moment";
import {List} from "semantic-ui-react/dist/commonjs/elements/List";

const RemotesList = ({remotes, handleShowDetails, handleFetchFiles}) => (
    <Segment.Group>
        {remotes && remotes.map(remote => (
            <Segment key={remote.hostname}>
                <Icon
                    name="sync"
                    style={{ color: (remote.files && remote.files.length > 0) ? "green" : "inherit"}}
                />
                <a onClick={() => handleFetchFiles(remote)}>Refresh files</a>
                <Message>
                    <Message.Header as={'a'} onClick={() => handleShowDetails(remote)}>
                        {`${remote.hostname}:${remote.port}`}
                    </Message.Header>
                    Last seen: {moment.unix(remote.lastseen).format("HH:mm")}
                </Message>
            </Segment>
        ))}
    </Segment.Group>
);

export default RemotesList;