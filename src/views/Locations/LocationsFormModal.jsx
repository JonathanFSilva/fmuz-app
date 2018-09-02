import React from "react";
import PropTypes from "prop-types";
import FormData from "form-data";
// Perfect scroolbar
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
// @material-ui/core
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
// @material-ui/icons
// import AddAlert from "@material-ui/icons/AddAlert";
import Save from "@material-ui/icons/Save";
import Close from "@material-ui/icons/Close";
// core components
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardFooter from "components/Card/CardFooter";
import CustomInput from "components/CustomInput/CustomInput";
// import Snackbar from "components/Snackbar/Snackbar";

import LocationService from "services/locations";


const initialState = {
  name: '',
  description: ''
}


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class LocationsFormModal extends React.Component {
  constructor() {
    super();
    this.locationService = new LocationService();
    this.state = initialState;
  }

  componentDidUpdate = async () => {
    if (this.props.modalType === "Editar" && this.props.open === true) {
      if (this.state.name === '' && this.state.description === '') {
        await this.locationService.getOne(this.props.locationId)
          .then(({ data }) => {
            this.setState({ name: data.name, description: data.description });
          })
          .catch((err) => {
            console.log(err);
          })
      }
    }
  };

  formCreateSubmit = async (e) => {
    e.preventDefault();

    const { name, description } = this.state;

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);

    await this.locationService.create(formData)
      .then(({ data }) => {
        this.setState(initialState);

        this.props.handleClose();
      })
      .catch((err) => {
        console.log(err);
      })

  };

  formEditSubmit = async (e) => {
    e.preventDefault();

    const { name, description } = this.state;

    const formData = new FormData();

    formData.append("id", this.props.locationId);
    formData.append("name", name);
    formData.append("description", description);

    await this.locationService.update(formData)
      .then(({ data }) => {
        this.setState(initialState);

        this.props.handleClose();
      })
      .catch((err) => {
        console.log(err);
      })
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleCancel = () => {
    this.setState(initialState);

    this.props.handleClose();
  }

  render() {
    const { open, modalType, handleClose } = this.props;
    const { name, description } = this.state;
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
            <CardHeader color="success" style={{ padding: "0", zIndex: "1500" }}>
              <center><h4>{`${modalType} Local`}</h4></center>
            </CardHeader>
         
            <PerfectScrollbar>
              <CardBody>
                <CustomInput
                  id="name"
                  labelText="Nome do Local"
                  formControlProps={{
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
                <CustomInput
                  id="description"
                  labelText="Descrição"
                  formControlProps={{
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
            </PerfectScrollbar>
          </Card>
        </Dialog>
      </div>
    );
  }
}

LocationsFormModal.propTypes = {
  modalType: PropTypes.oneOf(["Cadastrar", "Editar", ""]),
}

export default LocationsFormModal;
