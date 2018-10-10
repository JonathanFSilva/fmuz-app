import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";

import tableStyle from "../../assets/jss/fruticulture/components/tableStyle.jsx";

// function desc(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function stableSort(array, cmp) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = cmp(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map(el => el[0]);
// }

// function getSorting(order, orderBy) {
//   return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
// }

class DataTableHead extends React.PureComponent {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { classes, action, order, orderBy, tableHead, tableHeaderColor } = this.props;

    return (
      <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
        <TableRow>
          {tableHead.map((prop) => {
            return (
              <TableCell
                key={prop.key}
                sortDirection={orderBy === prop.key ? order : false}
                className={classes.tableCell + " " + classes.tableHeadCell}
              >
                <Tooltip title="Ordenar" placement="top" enterDelay={300} classes={{ tooltip: classes.tooltip }}>
                  <TableSortLabel
                    active={orderBy === prop.key}
                    direction={order}
                    onClick={this.createSortHandler(prop.key)}
                    className={classNames(classes.root, { [classes.active]: orderBy === prop.key })}
                  >
                    {prop.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)
          }
          {
            action
              ? <TableCell className={classes.tableCell + " " + classes.tableHeadCell} numeric>
                  {"Ações"}
                </TableCell>
              : null
          }
        </TableRow>
      </TableHead>
    );
  }
}

DataTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  tableHead: PropTypes.arrayOf(PropTypes.object),
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
};

export default withStyles(tableStyle)(DataTableHead);
