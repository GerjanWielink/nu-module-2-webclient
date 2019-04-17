import React from "react";
import { withRouter } from 'react-router-dom';
import { Container, Menu, Image} from "semantic-ui-react";
import nedap from "../static/nedap.svg";


const AppContainer = ({ children, history }) => (
    <React.Fragment>
        <Menu fixed='top' inverted >
            <Container>
                <Menu.Item as='a' header onClick={() => history.push("/")}>
                    <Image size='mini' src={nedap}></Image>
                    &nbsp;&nbsp; GTP
                </Menu.Item>

                <Menu.Item as='a' onClick={() => history.push("/")}>
                    Remotes
                </Menu.Item>

                <Menu.Item as='a' onClick={() => history.push("/downloads")}>
                    Downloads
                </Menu.Item>
            </Container>
        </Menu>
        <Container text style={{ marginTop: '7em'}}>
            {children}
        </Container>
    </React.Fragment>
);

export default withRouter(AppContainer);