import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./../index.css";
import {Home} from './Home';
import { Configuration } from './Configuration';

ReactDOM.render(<Configuration />, document.getElementById('root'));