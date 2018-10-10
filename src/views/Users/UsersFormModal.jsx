import React from "react";
import PropTypes from "prop-types";
// form data
import Blob from "blob";
import Files from "react-files";
import FormData from "form-data";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import Save from "@material-ui/icons/Save";
// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card";
import CardAvatar from "../../components/Card/CardAvatar";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import CardFooter from "../../components/Card/CardFooter";
import CustomInput from "../../components/CustomInput/CustomInput";
import GridItem from "../../components/Grid/GridItem";

import FormValidator from "../../validations/FormValidator";

import UserService from "../../services/user";

import checkboxAdnRadioStyle from "assets/jss/fruticulture/checkboxAdnRadioStyle.jsx";


const initialState = {
  name: '',
  email: '',
  username: '',
  password: '',
  password_confirmation: '',
  thumbnail: 'http://18.231.25.86/api/users/images/user.jpeg',
  is_admin: false,
}


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class UsersFormModal extends React.PureComponent {
  constructor() {
    super();
    this.userService = new UserService();
    this.validator = new FormValidator([
      {
        field: 'name',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      },
      {
        field: 'email',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      },
      {
        field: 'email',
        method: 'isEmail',
        validWhen: true,
        message: 'O valor informado não é um e-mail válido'
      },
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
      },
      {
        field: 'password_confirmation',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      },
      {
        field: 'password_confirmation',
        method: this.passwordMatch,
        validWhen: true,
        message: 'As senhas não combinam'
      }
    ]);
    this.state = { ...initialState, validation: this.validator.valid() };
    this.submited = false;
  }

  componentDidUpdate = async () => {
    if (this.props.modalType === "Editar" && this.props.open === true) {
      if (this.state.name === ''
        && this.state.email === ''
        && this.state.username === ''
        && this.state.password === ''
        && this.state.password_confirmation === ''
      ) {
        await this.userService.getOne(this.props.userId)
          .then(({ data }) => {
            this.setState({
              name: data.name,
              email: data.email,
              username: data.username,
              password: data.password,
              password_confirmation: data.password,
              thumbnail: data.url,
              is_admin: data.is_admin,
            });
          });
      }
    }
  };

  passwordMatch = (confirmation, state) => (state.password === confirmation)

  handleFileChange = (files) => {
    this.setState({ thumbnail: files[files.length - 1] });
  };

  handleInputChange = (event) => {
    event.preventDefault();

    this.setState({ [event.target.id]: event.target.value });
  };

  handleToogle = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleCancel = () => {
    this.setState({ ...initialState, validation: this.validator.valid() });
    this.submited = false;

    this.props.handleClose();
  }

  formCreateSubmit = async (event) => {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submited = true;

    if (validation.isValid) {
      const { name, email, username, password, is_admin, thumbnail } = this.state;

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("is_admin", is_admin ? 1 : 0);

      if (typeof thumbnail === 'string') {
        formData.append("thumbnail", thumbnail);
      } else {
        formData.append("thumbnail", new Blob([thumbnail], { type: thumbnail.type }), thumbnail.name);
      }

      await this.userService.create(formData)
        .then(() => {
          this.submited = false;

          this.setState(initialState);

          this.props.handleClose();
          this.props.showNotification('Usuário cadastrado com sucesso', 'success', 'tr');
        })
        .catch((err) => {
          console.log(err);
          this.props.showNotification('Não foi possível realizar o cadastro', 'danger', 'tr');
        })
    }

  };

  formEditSubmit = async (event) => {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submited = true;

    if (validation.isValid) {
      const { name, email, username, password, is_admin, thumbnail } = this.state;

      const formData = new FormData();

      formData.append("id", this.props.userId);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("is_admin", is_admin ? 1 : 0);

      if (password !== '') {
        formData.append("password", password);
      }

      if (typeof thumbnail === 'string') {
        formData.append("thumbnail", thumbnail);
      } else {
        formData.append("thumbnail", new Blob([thumbnail], { type: thumbnail.type }), thumbnail.name);
      }

      await this.userService.update(formData)
        .then(() => {
          this.submited = false;

          this.setState(initialState);

          this.props.handleClose();
          this.props.showNotification('Usuário atualizado com sucesso', 'success', 'tr');
        })
        .catch(() => {
          this.props.showNotification('Não foi possível atualizar o cadastro', 'danger', 'tr');
        })
    }

  };

  render() {
    const { open, modalType, handleClose, classes } = this.props;
    const { name, email, username, password, password_confirmation, is_admin, thumbnail } = this.state;

    const validation = this.submited ? this.validator.validate(this.state) : this.state.validation;

    return (
      <div>
        <Dialog
          keepMounted
          open={open}
          onClose={handleClose}
          scroll="body"
          TransitionComponent={Transition}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none"
            }
          }}
        >
          <Card>
            <CardHeader color="success">
              <center><h4>{`${modalType} Usuário`}</h4></center>
            </CardHeader>
            <form autoComplete="off">
              <CardBody>
                <Grid container justify="center">
                  <GridItem xs={12} sm={12} md={6}>
                    <CardAvatar profile style={{ marginTop: "0px", cursor: "pointer" }}>
                      <Files
                        ref="files"
                        className="files-dropzone-gallery"
                        onChange={this.handleFileChange}
                        accepts={['image/*']}
                        clickable
                      >
                        <Tooltip title="Adicionar imagem de perfil">
                          {
                            typeof thumbnail === 'string'
                              ? <img alt="user-profile-thumbnail" src={thumbnail} />
                              : <img alt="user-profile-thumbnail" src={thumbnail.preview.url} />
                          }
                        </Tooltip>
                      </Files>
                    </CardAvatar>
                  </GridItem>
                </Grid>
                <Grid container justify="center">
                  <GridItem xs={12} sm={12} md={10}>
                    <CustomInput
                      id="name"
                      labelText="Nome completo"
                      error={validation.name.isInvalid}
                      helperText={validation.name.message}
                      formControlProps={{
                        error: validation.name.isInvalid,
                        required: true,
                        fullWidth: true,
                        style: { marginTop: "0px" }
                      }}
                      inputProps={{
                        autoFocus: true,
                        value: name,
                        onChange: this.handleInputChange,
                        type: "text",
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                      id="email"
                      labelText="E-mail"
                      error={validation.email.isInvalid}
                      helperText={validation.email.message}
                      formControlProps={{
                        error: validation.email.isInvalid,
                        required: true,
                        fullWidth: true,
                        style: { marginTop: "0px" }
                      }}
                      inputProps={{
                        value: email,
                        onChange: this.handleInputChange,
                        type: "email",
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                      id="username"
                      labelText="Login"
                      error={validation.username.isInvalid}
                      helperText={validation.username.message}
                      formControlProps={{
                        error: validation.username.isInvalid,
                        required: true,
                        fullWidth: true,
                        style: { marginTop: "0px" }
                      }}
                      inputProps={{
                        value: username,
                        onChange: this.handleInputChange,
                        type: "text",
                      }}
                    />
                  </GridItem>
                  {
                    modalType === 'Cadastrar'
                      ? <GridItem xs={12} sm={12} md={5}>
                        <CustomInput
                          id="password"
                          labelText="Senha"
                          error={validation.password.isInvalid}
                          helperText={validation.password.message}
                          formControlProps={{
                            error: validation.password.isInvalid,
                            required: true,
                            fullWidth: true,
                            style: { marginTop: "0px" }
                          }}
                          inputProps={{
                            value: password,
                            onChange: this.handleInputChange,
                            type: "password",
                            hidden: true
                          }}
                        />
                      </GridItem>
                      : null
                  }
                  {
                    modalType === 'Cadastrar'
                      ?
                      <GridItem xs={12} sm={12} md={5}>
                        <CustomInput
                          id="password_confirmation"
                          labelText="Confirme a senha"
                          error={validation.password_confirmation.isInvalid}
                          helperText={validation.password_confirmation.message}
                          formControlProps={{
                            error: validation.password_confirmation.isInvalid,
                            required: true,
                            fullWidth: true,
                            style: { marginTop: "0px" }
                          }}
                          inputProps={{
                            value: password_confirmation,
                            onChange: this.handleInputChange,
                            type: "password",
                          }}
                        />
                      </GridItem>
                      : null
                  }
                  <GridItem xs={12} sm={12} md={10}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={!!is_admin ? is_admin : false}
                          onChange={this.handleToogle('is_admin')}
                          checkedIcon={<Check className={classes.checkedIcon} />}
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                          }}
                        />
                      }
                      label="Administrador"
                      classes={{
                        label: classes.labelRoot
                      }}
                    />
                  </GridItem>
                </Grid>
              </CardBody>
              <CardFooter style={{ display: "block" }} align="right">
                <Button type="button" color="danger" onClick={this.handleCancel}>
                  <Close />
                </Button>
                <Button type="button" color="success" onClick={
                  modalType === "Cadastrar"
                    ? this.formCreateSubmit
                    : this.formEditSubmit
                }>
                  <Save />
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Dialog>
      </div>
    );
  }
}

UsersFormModal.propTypes = {
  modalType: PropTypes.oneOf(["Cadastrar", "Editar"]),
}

export default withStyles(checkboxAdnRadioStyle)(UsersFormModal);
