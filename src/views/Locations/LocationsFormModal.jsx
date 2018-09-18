import React from "react";
import PropTypes from "prop-types";
import FormData from "form-data";
// @material-ui/core
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
// @material-ui/icons
import Save from "@material-ui/icons/Save";
import Close from "@material-ui/icons/Close";
// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import CardFooter from "../../components/Card/CardFooter";
import CustomInput from "../../components/CustomInput/CustomInput";
import GridItem from "../../components/Grid/GridItem";

import FormValidator from "../../validations/FormValidator";

import LocationService from "../../services/locations";


const initialState = {
  name: '',
  description: ''
};


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class LocationsFormModal extends React.Component {
  constructor() {
    super();
    this.locationService = new LocationService();
    this.validator = new FormValidator([
      {
        field: 'name',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      },
      {
        field: 'description',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      }
    ]);
    this.state = { ...initialState, validation: this.validator.valid() };
    this.submited = false;
  }

  componentDidUpdate = async () => {
    if (this.props.modalType === "Editar" && this.props.open === true) {
      if (this.state.name === '' && this.state.description === '') {
        await this.locationService.getOne(this.props.locationId)
          .then(({ data }) => {
            this.setState({ name: data.name, description: data.description });
          });
      }
    }
  };

  formCreateSubmit = async (event) => {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submited = true;

    if (validation.isValid) {
      const { name, description } = this.state;

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);

      await this.locationService.create(formData)
        .then(() => {
          this.submited = false;

          this.setState(initialState);

          this.props.handleClose();
          this.props.showNotification('Local cadastrado com sucesso', 'success', 'tr');
        })
        .catch(() => {
          this.props.showNotification('Não foi possível realizar o cadastro', 'danger', 'tr');
        });

    }

  };

  formEditSubmit = async (event) => {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submited = true;

    if (validation.isValid) {
      const { name, description } = this.state;

      const formData = new FormData();

      formData.append("id", this.props.locationId);
      formData.append("name", name);
      formData.append("description", description);

      await this.locationService.update(formData)
        .then(() => {
          this.submited = false;

          this.setState(initialState);

          this.props.handleClose();
          this.props.showNotification('Local atualizado com sucesso', 'success', 'tr');
        })
        .catch(() => {
          this.props.showNotification('Não foi possível atualizar o cadastro', 'danger', 'tr');
        });
    }

  };

  handleInputChange = (event) => {
    event.preventDefault();

    this.setState({ [event.target.id]: event.target.value });
  };

  handleCancel = () => {
    this.setState(initialState);

    this.props.handleClose();
  };

  render() {
    const { open, modalType, handleClose } = this.props;
    const { name, description } = this.state;

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
            <CardHeader color="success" style={{ padding: "0" }}>
              <center><h4>{`${modalType} Local`}</h4></center>
            </CardHeader>
            <form autoComplete="off">
              <CardBody>
                <Grid container justify="center">
                  <GridItem xs={12} sm={12} md={10}>
                    <CustomInput
                      id="name"
                      labelText="Nome do Local"
                      error={validation.name.isInvalid}
                      helperText={validation.name.message}
                      formControlProps={{
                        error: validation.name.isInvalid,
                        required: true,
                        fullWidth: true
                      }}
                      inputProps={{
                        autoFocus: true,
                        value: name,
                        onChange: this.handleInputChange,
                        type: "text",
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={10}>
                    <CustomInput
                      id="description"
                      labelText="Descrição"
                      error={validation.description.isInvalid}
                      helperText={validation.description.message}
                      formControlProps={{
                        error: validation.description.isInvalid,
                        required: true,
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 2,
                        rowsMax: 10,
                        value: description,
                        onChange: this.handleInputChange,
                        type: "text",
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
      </div >
    );
  }
}

LocationsFormModal.propTypes = {
  modalType: PropTypes.oneOf(["Cadastrar", "Editar", ""]),
};

export default LocationsFormModal;
