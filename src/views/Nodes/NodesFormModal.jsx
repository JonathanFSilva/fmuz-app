import React from "react";
import PropTypes from "prop-types";
import FormData from "form-data";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
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
import CustomMaskedInput from "../../components/CustomMaskedInput/CustomMaskedInput";
import GridItem from "../../components/Grid/GridItem";
import SelectInput from "../../components/SelectInput/SelectInput";

import customInputStyle from "../../assets/jss/fruticulture/components/customInputStyle";

import FormValidator from "../../validations/FormValidator";

import LocationService from "../../services/locations.js";
import NodeService from "../../services/nodes.js";

const emptyState = {
  location_id: '',
  mac_address: ''
}

const initialState = {
  locations: [],
  location_id: '',
  mac_address: ''
}


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class NodesFormModal extends React.Component {
  constructor() {
    super();
    this.locationService = new LocationService();
    this.nodeService = new NodeService();
    this.validator = new FormValidator([
      {
        field: 'location_id',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      },
      {
        field: 'mac_address',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      },
      {
        field: 'mac_address',
        method: 'matches',
        args: [/^[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}$/],
        validWhen: true,
        message: 'Valor informado não é um endereço mac válido'
      },
    ]);
    this.state = { ...initialState, validation: this.validator.valid() };
    this.submited = false;
  }

  componentDidMount = async () => {
    await this.getAllLocations();
  }

  componentDidUpdate = async () => {
    if (this.props.modalType === "Editar" && this.props.open === true) {
      if (this.state.location_id === '' && this.state.mac_address === '') {
        await this.nodeService.getOne(this.props.nodeId)
          .then(({ data }) => {
            this.setState({ location_id: data.location_id, mac_address: data.mac_address });
          });
      }
    }
  };

  getAllLocations = async () => {
    await this.locationService.getAll()
      .then(({ data }) => {
        const locations = [];

        data.forEach((item) => {
          locations.push([item.id, item.name]);
        });

        this.setState({ locations, location_id: locations[0][0] });
      });
  };

  formCreateSubmit = async (event) => {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submited = true;

    if (validation.isValid) {
      const { location_id, mac_address } = this.state;

      const formData = new FormData();

      formData.append("location_id", location_id);
      formData.append("mac_address", mac_address);

      await this.nodeService.create(formData)
        .then(() => {
          this.submited = false;

          this.setState(emptyState);

          this.props.handleClose();
          this.props.showNotification('Nó cadastrado com sucesso', 'success', 'tr');
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
      const { location_id, mac_address } = this.state;

      const formData = new FormData();

      formData.append("id", this.props.nodeId);
      formData.append("location_id", location_id);
      formData.append("mac_address", mac_address);

      await this.nodeService.update(formData)
        .then(() => {
          this.submited = false;

          this.setState(emptyState);

          this.props.handleClose();
          this.props.showNotification('Nó atualizado com sucesso', 'success', 'tr');
        })
        .catch(() => {
          this.props.showNotification('Não foi possível atualizar o cadastro', 'danger', 'tr');
        });
    }

  };

  handleInputChange = (event) => {
    event.preventDefault();

    this.setState({ [event.target.name]: event.target.value });
  };

  handleCancel = () => {
    this.setState({ ...emptyState, validation: this.validator.valid() });
    this.submited = false;

    this.props.handleClose();
  }

  render() {
    const { open, modalType, handleClose } = this.props;
    const { location_id, mac_address, locations } = this.state;

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
              <center><h4>{`${modalType} Nó`}</h4></center>
            </CardHeader>
            <form autoComplete="off">
              <CardBody>
                <Grid container justify="center">
                  <GridItem xs={12} sm={12} md={10}>
                    <SelectInput
                      id="location_id"
                      labelText="Localização"
                      error={validation.location_id.isInvalid}
                      helperText={validation.location_id.message}
                      formControlProps={{
                        error: validation.location_id.isInvalid,
                        required: true,
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "location_id",
                        value: location_id,
                        onChange: this.handleInputChange,
                        type: "text"
                      }}
                      options={locations}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={10}>
                    <CustomMaskedInput
                      id="mac_address"
                      labelText="Endereço MAC"
                      error={validation.mac_address.isInvalid}
                      helperText={validation.mac_address.message}
                      formControlProps={{
                        error: validation.mac_address.isInvalid,
                        required: true,
                        fullWidth: true
                      }}
                      inputProps={{
                        name: "mac_address",
                        value: mac_address,
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
      </div>
    );
  }
}

NodesFormModal.propTypes = {
  modalType: PropTypes.oneOf(["Cadastrar", "Editar", ""]),
}

export default withStyles(customInputStyle)(NodesFormModal);
