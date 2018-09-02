import React from "react";
import PropTypes from "prop-types";

import AuthService from "services/auth";


const withAuthentication = (WrappedComponent) => {
  class HOC extends React.Component {
    constructor() {
      super();
      this.authService = new AuthService();
    }

    componentDidMount = () => {
      if (!this.authService.isAuthenticated()) {
        this.props.history.replace('/auth/authenticate');
      }
    };

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  return HOC;
};

withAuthentication.propTypes = {
  WrappedComponent: PropTypes.object.isRequired
};

export default withAuthentication;
