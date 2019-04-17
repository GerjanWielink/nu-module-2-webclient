import React from 'react';
import { Route, Switch } from "react-router-dom";

import Dashboard from "./dashboard";
import Downloads from "./downloads";

const Routes = () => (
    <Switch>
        <Route component={Downloads} path="/downloads" exact />
        <Route component={Dashboard} path="/" />
    </Switch>
);

export default Routes;