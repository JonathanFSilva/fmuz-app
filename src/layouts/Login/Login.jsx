import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import authRoutes from "routes/auth";


const switchRoutes = (
  <Switch>
    {
      authRoutes.map((prop, key) => {
        if (prop.redirect)
          return <Redirect from={prop.path} to={prop.to} key={key} />

        return <Route path={prop.path} component={prop.component} key={key} />
      })
    }
  </Switch>
);


class Login extends React.Component {
  render() {
    return (
      <div>
        {switchRoutes}
      </div>
    );
  }
}

export default Login;
