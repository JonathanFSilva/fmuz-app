import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
// import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
// import Email from "@material-ui/icons/Email";
// import Lock from "@material-ui/icons/Lock";
import Slide from "@material-ui/core/Slide";
// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import CustomInput from "../../components/CustomInput/CustomInput";
import GridItem from "../../components/Grid/GridItem";
import Snackbar from "../../components/Snackbar/Snackbar";

import background from "../../assets/img/sidebar.jpg";

import FormValidator from "../../validations/FormValidator";

import AuthService from "../../services/auth";


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
    this.validator = new FormValidator([
      {
        field: 'username',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      },
      {
        field: 'password',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      }
    ]);
    this.state = {
      username: '',
      password: '',
      notificationOpen: false,
      notificationColor: 'danger',
      notificationPlace: 'tr',
      notificationMessage: '',
      validation: this.validator.valid()
    };
    this.submited = false;
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
    });

    setTimeout(() => {
      this.setState({ notificationOpen: false, notificationMessage: '', });
    }, 6000);
  };

  onFormSubmit = async (event) => {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submited = true;

    if (validation.isValid) {
      try {
        await this.authService.login(this.state.username, this.state.password);
        this.props.history.replace('/');
      } catch (err) {
        this.showNotification('Falha na autenticação!', 'danger');
      }
    }
  };

  handleInputChange = (event) => {
    event.preventDefault();

    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    const validation = this.submited ? this.validator.validate(this.state) : this.state.validation;

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

        <Grid container alignItems="center" justify="center" className={classes.gridStyle} xs={10} sm={10} md={4}>
          <Dialog
            keepMounted
            open={true}
            scroll="body"
            TransitionComponent={Transition}
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
            PaperProps={{
              style: {
                backgroundColor: "transparent",
                boxShadow: "none",
                minHeight: "300px",
                maxWidth: "300px"
              }
            }}
          >
            <Card>
              <CardHeader color="success" style={{ padding: "0" }}>
                <center><h3>Login</h3></center>
              </CardHeader>
              <form autoComplete="off">
                <CardBody>
                  <Grid container justify="center">
                    <GridItem>
                      <CustomInput
                        id="username"
                        labelText="Usuario"
                        error={validation.username.isInvalid}
                        helperText={validation.username.message}
                        formControlProps={{
                          error: validation.username.isInvalid,
                          required: true,
                          fullWidth: true
                        }}
                        inputProps={
                          {
                            // endAdornment: (
                            //   <InputAdornment position="end">
                            //     <Email color="disabled" />
                            //   </InputAdornment>
                            // ),
                            autoFocus: true,
                            onChange: this.handleInputChange,
                            type: "text",
                          }
                        }
                      />
                    </GridItem>
                    <GridItem>
                      <CustomInput
                        id="password"
                        labelText="Senha"
                        error={validation.password.isInvalid}
                        helperText={validation.password.message}
                        formControlProps={{
                          error: validation.password.isInvalid,
                          required: true,
                          fullWidth: true
                        }}
                        inputProps={
                          {
                            // endAdornment: (
                            //   <InputAdornment position="end">
                            //     <Lock color="disabled" />
                            //   </InputAdornment>
                            // ),
                            // eslint-disable-next-line
                            onKeyPress: (event) => { event.key === "Enter" ? this.onFormSubmit(event) : null },
                            onChange: this.handleInputChange,
                            type: "password",
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
              </form>
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
