import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withRouter, NavLink } from "react-router-dom";
// perfect scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import Dropdown from "./Dropdown";

import sidebarStyle from "../../assets/jss/fruticulture/components/sidebarStyle.jsx";
import userImage from "../../assets/img/faces/user.jpeg";
import UserContent from "./UserContent";

import AuthService from "../../services/auth";


const authService = new AuthService();

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    // return props.location.pathname.indexOf(routeName) > -1 ? true : false;
    return props.location.pathname === routeName ? true : false;
  }
  const { classes, color, logo, image, logoText, routes } = props;

  var links = (
    <List className={classes.list}>
      {
        routes.map((prop, key) => {
          if (prop.redirect || prop.rootId > 0) return null;

          if (prop.admin && !authService.isAdmin()) return null;

          var listItemClasses;
          if (prop.sidebarName === "Sair") {
            listItemClasses = classNames({
              [" " + classes["red"]]: true
            });
          } else {
            listItemClasses = classNames({
              [" " + classes[color]]: activeRoute(prop.path)
            });
          }
          const whiteFontClasses = classNames({
            [" " + classes.whiteFont]: activeRoute(prop.path)
          });

          if (prop.dropdown) {
            const content = [];

            routes.map((item) => {
              if (item.rootId === prop.id) {
                content.push(item);
              }
            });

            return (
              <Dropdown color={color} pathname={props.location.pathname} root={prop} content={content} />
            );
          } else {
            return (
              <NavLink
                to={prop.path}
                className={classes.item}
                activeClassName="active"
                key={key}
              >
                <ListItem button className={classes.itemLink + listItemClasses}>
                  <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
                    {typeof prop.icon === "string" ? (
                      <Icon>{prop.icon}</Icon>
                    ) : (
                        <prop.icon />
                      )}
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.sidebarName}
                    className={classes.itemText + whiteFontClasses}
                    disableTypography={true}
                  />
                </ListItem>
              </NavLink>
            );
          }
        })}
    </List>
  );

  var brand = (
    <div className={classes.logo}>
      <a href="http://18.231.25.86/" className={classes.logoLink}>
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" style={{ width: "25px" }} />
        </div>
        {logoText}
      </a>
    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={props.open}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            <PerfectScrollbar>
              <UserContent classes={classes} userImage={userImage} {...props} />
              {links}
            </PerfectScrollbar>
          </div>
          {
            image !== undefined
              ? (<div className={classes.background} style={{ backgroundImage: "url(" + image + ")" }} />)
              : null
          }
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="left"
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            <PerfectScrollbar>
              <UserContent classes={classes} userImage={userImage} {...props} />
              {links}
            </PerfectScrollbar>
          </div>
          {
            image !== undefined
              ? (<div className={classes.background} style={{ backgroundImage: "url(" + image + ")" }} />)
              : null
          }
        </Drawer>
      </Hidden>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(sidebarStyle)(Sidebar));
