import * as React from 'react';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "../../index.css";
import { ConfigRouter } from './ConfigRouter';

/* Sample when using react-router-dom */
export const App = () => {
    return <>
        <ConfigRouter />
    </>
}