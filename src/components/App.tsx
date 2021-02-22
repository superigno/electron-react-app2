import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./../index.css";
import { Configuration } from './Configuration';

const App = () => {
    return <>

        <Configuration />

    </>
}

ReactDOM.render(<App />, document.getElementById('root'));