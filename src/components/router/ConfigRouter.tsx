import React from 'react';
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { Sample } from './Sample';
import { Home } from './Home';

export const ConfigRouter = () => {
   return (
        <MemoryRouter>
          <Switch>
            <Route exact path="/" component={Home} /> {/* Default landing page */}
            <Route path="/sample" component={Sample} />
        </Switch>
      </MemoryRouter>
  );
}