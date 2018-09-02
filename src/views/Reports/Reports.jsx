import React from "react";

import withAuthentication from "hocs/withAuthentication";


class Reports extends React.Component {
  render() {
    return (
      <div>
        {"Reports Page"}
      </div>
    );
  }
}

export default withAuthentication(Reports);
