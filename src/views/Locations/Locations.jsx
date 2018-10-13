import React from "react";
import PropTypes from "prop-types";
// react moment
// import Moment from "react-moment";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Add from "@material-ui/icons/Add";
import AddAlert from "@material-ui/icons/AddAlert";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import CardBody from "../../components/Card/CardBody";
import DataTable from "../../components/Table/DataTable";
import GridItem from "../../components/Grid/GridItem";
import Snackbar from "../../components/Snackbar/Snackbar";

import LocationsFormModal from "./LocationsFormModal.jsx";

import LocationService from "../../services/locations";
import withAdmin from "../../hocs/withAdmin";

import dashboardStyle from "../../assets/jss/fruticulture/views/dashboardStyle";


const Moment = require('moment');


class Locations extends React.Component {
  constructor() {
    super();
    this.locationService = new LocationService();
    this.state = {
      locations: [],
      confirmDeleteOpen: false,
      modalFormOpen: false,
      modalType: '',
      notificationOpen: false,
      notificationColor: 'danger',
      notificationPlace: 'tr',
      notificationMessage: ''
    };
  }

  componentDidMount = async () => {
    await this.getAllLocations();
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

  getAllLocations = async () => {
    await this.locationService.getAll()
      .then(({ data }) => {
        const locations = [];

        data.forEach((item) => {
          locations.push(
            {
              id: item.id,
              name: item.name,
              description: item.description,
              max_humidity: !!item.max_humidity ? item.max_humidity + '%' : '---',
              min_humidity: !!item.min_humidity ? item.min_humidity + '%' : '---',
              max_temperature: !!item.max_temperature ? item.max_temperature + '%' : '---',
              min_temperature: !!item.min_temperature ? item.min_temperature + '%' : '---',
              updated_at: Moment(item.updated_at).format("DD/MM/YYYY HH:mm")
            }
          );
        });

        this.setState({ locations }, () => { console.log(this.state) });
      });
  };

  deleteLocation = async () => {
    await this.locationService.delete(this.state.deleteId)
      .then(() => {
        this.setState({ deleteId: undefined });
        this.getAllLocations();
        this.handleCloseConfirmDelete();
        this.showNotification('Local excluido com sucesso!', 'success', 'tr');
      })
      .catch(() => {
        this.showNotification('Não foi possível excluir o local!', 'danger', 'tr');
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
          showNotification={this.showNotification}
        />
        <Snackbar
          place={this.state.notificationPlace}
          color={this.state.notificationColor}
          message={this.state.notificationMessage}
          icon={AddAlert}
          open={this.state.notificationOpen}
          closeNotification={() => this.setState({ notificationOpen: false })}
          close
        />
        <Grid container alignItems="center" justify="center">
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success" icon>
                <CardIcon color="success">
                  <Button type="button" color="transparent" className={classes.cardIconButton} onClick={this.handleClickOpen}>
                    <Tooltip title="Adicionar Local" enterDelay={300} placement="bottom" classes={{ tooltip: classes.tooltip }}>
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
                    { label: 'Max. Temp.', key: 'max_temperature' },
                    { label: 'Min. Temp.', key: 'min_temperature' },
                    { label: 'Max. Umi.', key: 'max_humidity' },
                    { label: 'Min. Umi.', key: 'min_humidity' },
                    { label: 'Última alteração', key: 'updated_at' }
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

