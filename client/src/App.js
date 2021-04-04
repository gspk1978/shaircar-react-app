import React from 'react';
import {Route, Switch} from 'react-router-dom';
import VinLookup from './VinLookup';

// Creating a resource path to access the vin look up page this will be rendered once browser router 
// forwards the request via the resource path
function App() {
  return (
    <Switch>
      <Route exact path="/vinlookup" component={VinLookup} />
    </Switch>
  )
}

export default App;
