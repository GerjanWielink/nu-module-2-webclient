import React from 'react';
import {Segment, Icon, Message, Confirm} from "semantic-ui-react";
import FormattedSize from "../../components/FormattedSize";

const FilesList = ({files, onClickFile, onConfirmModal, onModalClose, activeConfirmationModal, type}) => (
    <Segment.Group>
        {files && files.map(file => (
            <Segment key={file.filename}>
                <Icon
                    name={type}
                />
                <a onClick={() => onClickFile(type + file.filename)}>{type}</a>
                <Message>
                    <Message.Header>
                        {file.filename}
                    </Message.Header>
                    <FormattedSize bytes={file.size}/>
                </Message>
                <Confirm
                    open={activeConfirmationModal === (type + file.filename)}
                    onCancel={onModalClose}
                    onConfirm={() => onConfirmModal(file.filename)}
                />
            </Segment>
        ))}
    </Segment.Group>
);

export default FilesList;