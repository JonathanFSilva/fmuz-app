import React from "react";
import PropTypes from "prop-types";
// Perfect scroolbar
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
// form data
import FormData from "form-data";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
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
// import CustomInput from "components/CustomInput/CustomInput";
import CustomMaskedInput from "components/CustomMaskedInput/CustomMaskedInput";
import GridItem from "components/Grid/GridItem";
// import Snackbar from "components/Snackbar/Snackbar";

import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle";


import LocationService from "services/locations.js";
import NodeService from "services/nodes.js";

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
    this.state = initialState;
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
          })
          .catch((err) => {
            console.log(err);
          })
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

        this.setState({ locations });
      })
      .catch((err) => {
        console.log(err);
      })
  };

  formCreateSubmit = async (e) => {
    e.preventDefault();

    const { location_id, mac_address } = this.state;

    const formData = new FormData();

    formData.append("location_id", location_id);
    formData.append("mac_address", mac_address);

    await this.nodeService.create(formData)
      .then(({ data }) => {
        this.setState(emptyState);

        this.props.handleClose();
      })
      .catch((err) => {
        console.log(err);
      })

  };

  formEditSubmit = async (e) => {
    e.preventDefault();

    const { location_id, mac_address } = this.state;

    const formData = new FormData();

    formData.append("id", this.props.nodeId);
    formData.append("location_id", location_id);
    formData.append("mac_address", mac_address);

    await this.nodeService.update(formData)
      .then(({ data }) => {
        this.setState(emptyState);

        this.props.handleClose();
      })
      .catch((err) => {
        console.log(err);
      })
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCancel = () => {
    this.setState(emptyState);

    this.props.handleClose();
  }

  render() {
    const { open, modalType, handleClose, classes } = this.props;
    const { location_id, mac_address, locations } = this.state;
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
              <center><h4>{`${modalType} Nó`}</h4></center>
            </CardHeader>

            <PerfectScrollbar>
              <CardBody>
                <Grid container justify="center">
                  <GridItem xs={12} sm={12} md={10}>
                    <FormControl className={classes.formControl} required fullWidth>
                      <InputLabel htmlFor="location_id" className={classes.labelRoot}>Localização</InputLabel>
                      <Select
                        value={location_id}
                        onChange={this.handleInputChange}
                        inputProps={{
                          name: 'location_id',
                          required: true,
                          style: { underline: classes.underline },
                        }}
                      >
                        {
                          locations.map((item, key) => {
                            return (
                              <MenuItem value={item[0]} key={key}>{item[1]}</MenuItem>
                            );
                          })
                        }
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={10}>
                    {/* <CustomInput
                      id="mac_address"
                      labelText="Endereço MAC"
                      formControlProps={{
                        required: true,
                        fullWidth: true
                      }}
                      inputProps={{
                        name: "mac_address",
                        value: mac_address,
                        onChange: this.handleInputChange,
                        type: "text",
                      }}
                    /> */}
                    <CustomMaskedInput
                      id="mac_address"
                      labelText="Endereço MAC"
                      formControlProps={{
                        required: true,
                        fullWidth: true
                      }}
                      inputProps={{
                        name: "mac_address",
                        value: mac_address,
                        onChange: this.handleInputChange,
                        type: "text",
                      }}
                      mask={[
                        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
                        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
                        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
                        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
                        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
                        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/
                      ]}
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
            </PerfectScrollbar>
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
