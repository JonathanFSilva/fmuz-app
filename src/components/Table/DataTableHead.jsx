import React from 'react';
import classNames from "classnames";
import PropTypes from 'prop-types';
// @material-ui/core components
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle";

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
                className={classes.tableCell + " " + classes.tableHeadCell}
                sortDirection={orderBy === prop.key ? order : false}
                key={prop.key}
              >
                <Tooltip title="Ordenar" enterDelay={300}>
                  <TableSortLabel
                    direction={order}
                    active={orderBy === prop.key}
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
