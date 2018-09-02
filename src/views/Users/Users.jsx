import React from "react";
import PropTypes from "prop-types";
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
import UsersFormModal from "./UsersFormModal.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import withAdmin from "hocs/withAdmin";

import UserService from "services/user.js";


class Users extends React.PureComponent {
  constructor() {
    super();
    this.userService = new UserService();
    this.state = {
      users: [],
      confirmDeleteOpen: false,
      modalFormOpen: false,
      modalType: "Cadastrar",
    };
  }

  componentDidMount = async () => {
    await this.getAllUsers();
  };

  getAllUsers = async () => {
    await this.userService.getAll()
      .then(({ data }) => {
        const users = [];

        data.forEach((item) => {
          users.push([
            item.id,
            item.name,
            item.email,
            item.username,
            item.is_admin === 1
              ? <Check style={{ color: "#4caf50" }} />
              : <Close style={{ color: "#f44336" }} />
          ]);
        });

        this.setState({ users });
      })
      .catch((err) => {
        console.log(err);
      })
  }

  deleteUser = async () => {
    await this.userService.delete(this.state.deleteId)
      .then(({ data }) => {
        this.setState({ deleteId: undefined });
        this.getAllUsers();
        this.handleCloseConfirmDelete();
      })
      .catch((err) => {
        console.log(err);
      })
  }

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
    this.getAllUsers();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <UsersFormModal
          open={this.state.modalFormOpen}
          modalType={this.state.modalType}
          userId={this.state.updateId || undefined}
          handleClose={() => this.handleClose()}
        />
        <Grid container alignItems="center" justify="center">
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success" icon>
                <CardIcon color="success">
                  <Button type="button" color="transparent" className={classes.cardIconButton} onClick={this.handleClickOpen}>
                    <Tooltip title="Adicionar Usuário" enterDelay={300}>
                      <Add />
                    </Tooltip>
                  </Button>
                </CardIcon>
                <h3 className={classes.cardTitle}>Usuários do sistema</h3>
              </CardHeader>
              <CardBody style={{ paddingTop: "0px" }}>
                <DataTable
                  action={true}
                  tableHeaderColor="success"
                  tableHead={[
                    { label: "ID", key: "id" },
                    { label: "Nome", key: "name" },
                    { label: "E-mail", key: "email" },
                    { label: "Usuário", key: "username" },
                    { label: "Admnistrador", key: "is_admin" },
                  ]}
                  tableData={this.state.users || []}
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
              {"Você deseja realmente excluir este registro?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button type="button" color="danger" onClick={this.handleCloseConfirmDelete}>
              <Close />
            </Button>
            <Button type="button" color="success" onClick={this.deleteUser}>
              <Check />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired
};

Users = withStyles(dashboardStyle)(Users);


export default withAdmin(Users);
