import * as React from 'react';
import {
  HashRouter,
  Route,
  Switch,
} from 'react-router-dom';
import {
  withRouter
} from 'react-router';

import { App } from './App';

// After change location, scroll to top of the page.
const ScrollToTop = withRouter((props: any) => {
  const [prevLocation, setPrevLocation] = React.useState(props.location);
  const currentLocation = props.location;

  React.useEffect(() => {
    if (currentLocation !== prevLocation) {
      window.scrollTo(0, 0);
      setPrevLocation(currentLocation);
    }
  });
  return null;
});

const AppRouter: React.FC<{}> = (
) => {

  return (
    <HashRouter>
      <Switch>
        <Route 
          path='/'
        >
          <ScrollToTop />
          <App />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export {
  AppRouter
};
