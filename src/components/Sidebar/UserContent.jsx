import React, { Component } from "react";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import ExitToApp from "@material-ui/icons/ExitToApp";
// core components
import Button from "../../components/CustomButtons/Button";

import AuthService from "../../services/auth";


class UserContent extends Component {
  constructor() {
    super();
    this.authService = new AuthService();
    this.state = {
      confirmLogoutOpen: false,
    };
  }

  componentDidMount = () => {
    try {
      const userdata = this.authService.getProfile();
      this.setState({ name: userdata.name, avatar: userdata.avatar });
    } catch (err) {
      console.log(err);
    }
  }

  handleClickOpen = () => {
    this.setState({ confirmLogoutOpen: true });
  };

  handleClose = () => {
    this.setState({ confirmLogoutOpen: false });
  };

  handleLogout = async () => {
    await this.authService.logout();
    this.props.history.replace('/auth/authenticate');
  };

  render() {
    const { classes } = this.props;
    const { name, avatar } = this.state;

    return (
      <div className={classes.user}>
        <div align="center">
          <div>
            <img src={avatar || "assets/img/faces/user.jpeg"} alt="user-profile" className={classes.img} />
          </div>
          <div className={classes.whiteFont} style={{ paddingTop: "10px" }}>
            {name || ''}
          </div>
        </div>
        <List className={classes.list}>
          <NavLink to={'#'} className={classes.item} activeClassName="active" onClick={this.handleClickOpen}>
            <ListItem button className={classes.itemLink}>
              <ListItemIcon className={classes.itemIcon}>
                <ExitToApp style={{ color: "red" }} />
              </ListItemIcon>
              <ListItemText primary={'Sair'} className={classes.itemText} disableTypography={true} />
            </ListItem>
          </NavLink>
        </List>

        <Dialog
          open={this.state.confirmLogoutOpen}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirmação"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {"Você deseja realmente sair da aplicação?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button type="button" color="danger" onClick={this.handleClose}>
              <Close />
            </Button>
            <Button type="button" color="success" onClick={this.handleLogout}>
              <Check />
            </Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }
}

export default UserContent;
