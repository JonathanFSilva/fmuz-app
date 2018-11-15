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
import AddAlert from "@material-ui/icons/AddAlert";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import DataTable from "../../components/Table/DataTable.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Loading from "../../components/Loading/Loading";
import Snackbar from "../../components/Snackbar/Snackbar";

import UsersFormModal from "./UsersFormModal.jsx";

import UserService from "../../services/user.js";
import withAdmin from "../../hocs/withAdmin";

import dashboardStyle from "../../assets/jss/fruticulture/views/dashboardStyle.jsx";


class Users extends React.PureComponent {
  constructor() {
    super();
    this.userService = new UserService();
    this.state = {
      users: [],
      loading: true,
      confirmDeleteOpen: false,
      modalFormOpen: false,
      modalType: 'Cadastrar',
      notificationOpen: false,
      notificationColor: 'danger',
      notificationPlace: 'tr',
      notificationMessage: ''
    };
  }

  componentDidMount = async () => {
    await this.getAllUsers();
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

  getAllUsers = async () => {
    this.setState({ loading: true });

    await this.userService.getAll()
      .then(({ data }) => {
        const users = [];

        data.forEach((item) => {
          users.push(
            {
              id: item.id,
              name: item.name,
              email: item.email,
              username: item.username,
              is_admin: item.is_admin === 1
                ? <Check style={{ color: "#4caf50" }} />
                : <Close style={{ color: "#f44336" }} />
            }
          );
        });

        this.setState({ loading: false, users });
      });
  }

  deleteUser = async () => {
    this.setState({ loading: true });
    await this.userService.delete(this.state.deleteId)
      .then(({ data }) => {
        this.setState({ loading: false, deleteId: undefined });
        this.getAllUsers();
        this.handleCloseConfirmDelete();
        this.showNotification('Usuário excluido com sucesso!', 'success', 'tr');
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.showNotification('Não foi possível excluir o usuário!', 'danger', 'tr');
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
                    <Tooltip title="Adicionar Usuário" enterDelay={300} placement="bottom" classes={{ tooltip: classes.tooltip }}>
                      <Add />
                    </Tooltip>
                  </Button>
                </CardIcon>
                <h3 className={classes.cardTitle}>Usuários do sistema</h3>
              </CardHeader>
              <CardBody style={{ paddingTop: "0px" }} align="center">
                {
                  this.state.loading
                    ? <Loading />
                    :
                    <DataTable
                      action={["edit", "delete"]}
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
                }
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
