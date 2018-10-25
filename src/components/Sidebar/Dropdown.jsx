import React from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Icon from "@material-ui/core/Icon";

import SidebarStyles from "../../assets/jss/fruticulture/components/sidebarStyle";

import AuthService from "../../services/auth";

const authService = new AuthService();

const initialState = {
  open: false
}

class Dropdown extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { classes, color, pathname, root, content } = this.props;
    const { open } = this.state;

    function childrenActive(routeName) {
      return pathname.indexOf(routeName) > -1 ? true : false;
    }

    function activeRoute(routeName) {
      return pathname === routeName || pathname.indexOf(routeName) > -1 ? true : false;
    }

    return (
      <div>
        <ListItem
          button
          onClick={() => this.handleToggle()}
          className={classes.itemLink + classNames({ [" " + classes["white"]]: childrenActive(root.path) })}
        >
          <ListItemIcon className={classes.itemIcon}>
            {typeof root.icon === "string" ? (
              <Icon>{root.icon}</Icon>
            ) : (
                <root.icon />
              )}
          </ListItemIcon>
          <ListItemText
            inset
            primary={root.sidebarName}
            className={classes.itemText}
            disableTypography={true}
          />
          <ListItemSecondaryAction
            style={{ color: "#FFF", right: "20px" }}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemSecondaryAction>
        </ListItem>
        {
          open || childrenActive(root.path)
            ?
            content.map((item, key) => {

              if (item.redirect || item.sidebarName === undefined || (item.admin && !authService.isAdmin())) return null;

              var listItemClasses;
              listItemClasses = classNames({
                [" " + classes[color]]: activeRoute(item.path)
              });

              const whiteFontClasses = classNames({
                [" " + classes.whiteFont]: activeRoute(item.path)
              });

              return (
                <NavLink
                  to={item.path}
                  className={classes.item}
                  activeClassName="active"
                  key={key}
                >
                  <ListItem button className={classes.itemLink + listItemClasses}>
                    <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
                      <span />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.sidebarName}
                      className={classes.itemText + whiteFontClasses}
                      disableTypography={true}
                    />
                  </ListItem>
                </NavLink>
              )
            })
            : null
        }
      </div>
    );
  }
}


export default withStyles(SidebarStyles)(Dropdown);
