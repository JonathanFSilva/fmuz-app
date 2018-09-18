import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Add from "@material-ui/icons/Add";
import AddAlert from "@material-ui/icons/AddAlert";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import DataTable from "../../components/Table/DataTable.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Snackbar from "../../components/Snackbar/Snackbar";

import UserService from "../../services/user.js";
import withAdmin from "../../hocs/withAdmin";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";


import withAuthentication from "hocs/withAuthentication";


class Reports extends React.Component {
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

Reports.propTypes = {
  classes: PropTypes.object.isRequired
};

Reports = withStyles(dashboardStyle)(Reports);

export default withAuthentication(Reports);
