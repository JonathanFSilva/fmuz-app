import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// material-ui/icons 
import Add from "@material-ui/icons/Add";


const toolbarStyles = theme => ({
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  }
});

let DataTableToolbar = props => {
  const { classes } = props;

  return (
    <Toolbar>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Tooltip title="Delete">
          <IconButton aria-label="Delete">
            <Add />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

DataTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

export default withStyles(toolbarStyles)(DataTableToolbar);
