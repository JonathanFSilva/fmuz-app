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
      // Verifica se o usuario esta logado 
      if (!this.authService.isAuthenticated()) {
        this.props.history.replace('/auth/authenticate');
      }

      // Verifica se o usuario é admin
      if (!this.authService.isAdmin()) {
        this.props.history.replace('/');
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
