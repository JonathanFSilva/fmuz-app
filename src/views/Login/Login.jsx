/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
// Perfect scroolbar
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
import Slide from "@material-ui/core/Slide";
// core components
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardFooter from "components/Card/CardFooter";
import CustomInput from "components/CustomInput/CustomInput";
import Dialog from "@material-ui/core/Dialog";
// import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Snackbar from "components/Snackbar/Snackbar";

import background from "assets/img/sidebar.jpg";

import AuthService from "services/auth";

const styles = () => ({
  background: {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
  gridStyle: {
    minHeight: "100vh",
  },
  buttonContainer: {
    paddingTop: "20px",
    justify: "center",
  }
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class Login extends React.Component {
  constructor() {
    super();
    this.authService = new AuthService();
    this.state = {
      notificationOpen: false,
      notificationColor: 'danger',
      notificationPlace: 'tr',
      notificationMessage: ''
    }
  }

  componentWillMount = () => {
    if (this.authService.isAuthenticated()) {
      this.props.history.replace('/');
    }
  };

  showNotification = (message, color, place = 'tr') => {
    this.setState({
      notificationOpen: true,
      notificationMessage: message,
      notificationColor: color,
      notificationPlace: place
    }, () => {console.log(this.state)});

    setTimeout(() => {
      this.setState({
        notificationOpen: false,
        notificationMessage: '',
        notificationColor: 'danger',
        notificationPlace: 'tr',
      });
    }, 6000);
  };

  onFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await this.authService.login(this.state.username, this.state.password);
      this.props.history.replace('/');
    } catch (err) {
      // console.log(err.data);
      this.showNotification('Falha na autenticação!', 'danger');
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.background}>
        <Snackbar
          place={this.state.notificationPlace}
          color={this.state.notificationColor}
          message={this.state.notificationMessage}
          icon={AddAlert}
          open={this.state.notificationOpen}
          closeNotification={() => this.setState({ notificationOpen: false })}
          close
        />

        <Grid container alignItems="center" justify="center" className={classes.gridStyle}>
          <Dialog
            keepMounted
            open={true}
            TransitionComponent={Transition}
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
            PaperProps={{
              style: {
                backgroundColor: "transparent",
                boxShadow: "none",
                minHeight: "300px"
              }
            }}
          >
            <Card>
              <CardHeader color="success">
                <center><h3>Login</h3></center>
              </CardHeader>

              <PerfectScrollbar>

                <CardBody>
                  <Grid>
                    <GridItem>
                      <CustomInput
                        id="username"
                        labelText="Usuario"
                        formControlProps={{ fullWidth: true }}
                        inputProps={
                          {
                            endAdornment: (
                              <InputAdornment position="end">
                                <Email color="disabled" />
                              </InputAdornment>
                            ),
                            autoFocus: true,
                            autoComplete: "off",
                            onChange: this.handleInputChange,
                            type: "text",
                            required: true
                          }
                        }
                      />
                    </GridItem>
                    <GridItem>
                      <CustomInput
                        id="password"
                        labelText="Senha"
                        formControlProps={{ fullWidth: true }}
                        inputProps={
                          {
                            endAdornment: (
                              <InputAdornment position="end">
                                <Lock color="disabled" />
                              </InputAdornment>
                            ),
                            onKeyPress: (event) => { event.key === "Enter" ? this.onFormSubmit(event) : null },
                            onChange: this.handleInputChange,
                            type: "password",
                            required: true
                          }
                        }
                      />
                    </GridItem>
                    <GridItem align="center">
                      <div className={classes.buttonContainer}>
                        <Button type="button" color="success" onClick={this.onFormSubmit}>
                          Entrar
                      </Button>
                      </div>
                    </GridItem>
                  </Grid>
                </CardBody>

              </PerfectScrollbar>
            </Card>
          </Dialog>
        </Grid>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
