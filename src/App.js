import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import { BrowserRouter } from 'react-router-dom';
import AppContainer from "./components/AppContainer";
import Routes from './routes';

const App = () => (
    <BrowserRouter>
        <AppContainer>
            <Routes />
        </AppContainer>
    </BrowserRouter>
);

export default App;
