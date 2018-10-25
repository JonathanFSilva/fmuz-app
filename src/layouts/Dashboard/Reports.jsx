import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ReportsRoutes from "../../routes/reports.jsx";

const switchRoutes = (
  <Switch>
    {
      ReportsRoutes.map((prop, key) => {
        if (prop.redirect)
          return <Redirect from={prop.path} to={prop.to} key={key} />;

        return <Route path={prop.path} component={prop.component} key={key} />;
      })
    }
  </Switch>
);


class Reports extends React.Component {

  render() {
    return (
      <div>
        {switchRoutes}
      </div>
    );
  }

};

export default Reports;
