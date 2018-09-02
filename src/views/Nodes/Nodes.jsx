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
import NodesFormModal from "./NodesFormModal.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import withAdmin from "hocs/withAdmin";

import NodeService from "services/nodes";


class Nodes extends React.Component {
  constructor() {
    super();
    this.nodeService = new NodeService();
    this.state = {
      nodes: [],
      confirmDeleteOpen: false,
      modalFormOpen: false,
      modalType: '',
    };
  }

  componentDidMount = async () => {
    await this.getAllNodes();
  };

  getAllNodes = async () => {
    await this.nodeService.getAll()
      .then(({ data }) => {
        const nodes = [];

        data.forEach((item) => {
          nodes.push([item.id, item.name, item.mac_address, <Moment format="DD/MM/YYYY - HH:mm">{item.created_at}</Moment>]);
        });

        this.setState({ nodes });
      })
      .catch((err) => {
        console.log(err);
      })
  };

  deleteNode = async () => {
    await this.nodeService.delete(this.state.deleteId)
      .then(({ data }) => {
        this.setState({ deleteId: undefined });
        this.getAllNodes();
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
    this.getAllNodes();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <NodesFormModal
          open={this.state.modalFormOpen}
          modalType={this.state.modalType}
          nodeId={this.state.updateId || undefined}
          handleClose={() => this.handleClose()}
        />
        <Grid container alignItems="center" justify="center">
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success" icon>
                <CardIcon color="success">
                  <Button type="button" color="transparent" className={classes.cardIconButton} onClick={this.handleClickOpen}>
                    <Tooltip title="Adicionar Nó" enterDelay={300}>
                      <Add />
                    </Tooltip>
                  </Button>
                </CardIcon>
                <h3 className={classes.cardTitle}>Nós da rede</h3>
              </CardHeader>
              <CardBody style={{ paddingTop: "0px" }}>
                <DataTable
                  action={true}
                  tableHeaderColor="success"
                  tableHead={[
                    { label: 'ID', key: 'id' },
                    { label: 'Localização', key: 'location' },
                    { label: 'MAC', key: 'mac_address' },
                    { label: 'Data de Criação', key: 'created_at' }
                  ]}
                  tableData={this.state.nodes || []}
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
          <DialogTitle id="alert-dialog-title">{"Deseja mesmo sair?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {"Let Google help apps determine location. This means sending anonymous location data to \
            Google, even when no apps are running."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button type="button" color="danger" onClick={this.handleCloseConfirmDelete}>
              <Close />
            </Button>
            <Button type="button" color="success" onClick={this.deleteNode}>
              <Check />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Nodes.propTypes = {
  classes: PropTypes.object.isRequired
};

Nodes = withStyles(dashboardStyle)(Nodes);

export default withAdmin(Nodes);

