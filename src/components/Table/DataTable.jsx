import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";

import tableStyle from "../../assets/jss/fruticulture/components/tableStyle.jsx";

import DataTableHead from "./DataTableHead.jsx";


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function getKeys(tableHead) {
  const keys = [];
  
  tableHead.map((el) => {
    keys.push(el.key);
  });

  return keys;
}


class DataTable extends React.Component {
  state = {
    order: 'desc',
    orderBy: '',
    page: 0,
    rowsPerPage: 25,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, action, tableHead, tableData, tableHeaderColor, openModal, deleteItem } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;

    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          <DataTableHead
            action={action}
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
            tableHead={tableHead}
            tableHeaderColor={tableHeaderColor}
          />
          <TableBody>
            {
              tableData.length > 0
                ? stableSort(tableData, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((prop, key) => {
                    return (
                      <TableRow key={key}>
                        {/* {prop.map((prop, key) => {
                          return (
                            <TableCell className={classes.tableCell} key={key}>
                              {prop}
                            </TableCell>
                          );
                        })} */}
                        {
                          getKeys(tableHead).map((el, k) => {
                            return (
                              <TableCell className={classes.tableCell} key={key + k}>
                                {prop[el]}
                              </TableCell>
                            );
                          })
                        }
                        {
                          action
                            ? <TableCell className={classes.tableCell} numeric>
                              <Tooltip title="Editar" placement="top" classes={{ tooltip: classes.tooltip }}>
                                <IconButton className={classes.action} onClick={() => openModal(prop.id)}>
                                  <Edit className={classes.actionIcon} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir" placement="top" classes={{ tooltip: classes.tooltip }}>
                                <IconButton className={classes.action} onClick={() => deleteItem(prop.id)}>
                                  <Delete className={classes.actionIcon} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            : null
                        }
                      </TableRow>
                    );
                  })
                : <TableRow>
                  <TableCell style={{ textAlign: "center" }} colSpan={tableHead.length}>
                    {"Nenhum dado encontrado!"}
                  </TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          page={page}
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage={'Resultados por página:'}
          labelDisplayedRows={({ from, to, count }) => `Exibindo: ${from}-${to} de ${count}`}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    );
  }
}

DataTable.defaultProps = {
  tableHeaderColor: "gray"
};

DataTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.array),
};

export default withStyles(tableStyle)(DataTable);
