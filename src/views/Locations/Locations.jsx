import React from "react";
import PropTypes from "prop-types";
// react moment
import Moment from 'react-moment';
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Add from "@material-ui/icons/Add";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
// core components
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import DataTable from "components/Table/DataTable.jsx";
import LocationsFormModal from "./LocationsFormModal.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import withAdmin from "hocs/withAdmin";

import LocationService from "services/locations";


class Locations extends React.Component {
  constructor() {
    super();
    this.locationService = new LocationService();
    this.state = {
      locations: [],
      confirmDeleteOpen: false,
      modalFormOpen: false,
      modalType: '',
    };
  }

  componentDidMount = async () => {
    await this.getAllLocations();
  };

  getAllLocations = async () => {
    await this.locationService.getAll()
      .then(({ data }) => {
        const locations = [];

        data.forEach((item) => {
          locations.push([item.id, item.name, item.description, <Moment format="DD/MM/YYYY - HH:mm">{item.created_at}</Moment>]);
        });

        this.setState({ locations });
      })
      .catch((err) => {
        console.log(err);
      })
  };

  deleteLocation = async () => {
    await this.locationService.delete(this.state.deleteId)
      .then(({ data }) => {
        this.setState({ deleteId: undefined });
        this.getAllLocations();
        this.handleCloseConfirmDelete();
      })
      .catch((err) => {
        console.log(err);
      })
  };

  handleOpenConfirmDelete = (id) => {
    this.setState({ confirmDeleteOpen: true, deleteId: id });
  };

  handleCloseConfirmDelete = () => {
    this.setState({ confirmDeleteOpen: false, deleteId: undefined });
  };

  openEditModal = (id) => {
    this.setState({ modalFormOpen: true, modalType: "Editar", updateId: id });
  };

  handleClickOpen = () => {
    this.setState({ modalFormOpen: true, modalType: "Cadastrar" });
  };

  handleClose = () => {
    this.setState({ modalFormOpen: false, updateId: undefined });
    this.getAllLocations();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <LocationsFormModal
          open={this.state.modalFormOpen}
          modalType={this.state.modalType}
          locationId={this.state.updateId || undefined}
          handleClose={() => this.handleClose()}
        />
        <Grid container alignItems="center" justify="center">
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success" icon>
                <CardIcon color="success">
                  <Button type="button" color="transparent" className={classes.cardIconButton} onClick={this.handleClickOpen}>
                    <Tooltip title="Adicionar Local" enterDelay={300}>
                      <Add />
                    </Tooltip>
                  </Button>
                </CardIcon>
                <h3 className={classes.cardTitle}>Locais</h3>
              </CardHeader>
              <CardBody style={{ paddingTop: "0px" }}>
                <DataTable
                  action={true}
                  tableHeaderColor="success"
                  tableHead={[
                    { label: 'ID', key: 'id' },
                    { label: 'Nome', key: 'name' },
                    { label: 'Descrição', key: 'description' },
                    { label: 'Data de Criação', key: 'created_at' }
                  ]}
                  tableData={this.state.locations || []}
                  openModal={this.openEditModal}
                  deleteItem={this.handleOpenConfirmDelete}
                />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Dialog
          open={this.state.confirmDeleteOpen}
          onClose={this.handleCloseConfirmDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirmação"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {"Voçê deseja realmente excluir este registro?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button type="button" color="danger" onClick={this.handleCloseConfirmDelete}>
              <Close />
            </Button>
            <Button type="button" color="success" onClick={this.deleteLocation}>
              <Check />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Locations.propTypes = {
  classes: PropTypes.object.isRequired
};

Locations = withStyles(dashboardStyle)(Locations);

export default withAdmin(Locations)

