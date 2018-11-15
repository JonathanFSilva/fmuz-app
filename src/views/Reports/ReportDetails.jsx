import React from "react";
import PropTypes from "prop-types";
import FormData from "form-data";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import ArrowBack from "@material-ui/icons/ArrowBack";
// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import DataTable from "../../components/Table/DataTable.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Loading from "../../components/Loading/Loading";

import UserService from "../../services/user.js";
import ReportsService from "../../services/reports.js";
import withAdmin from "../../hocs/withAdmin";

import dashboardStyle from "../../assets/jss/fruticulture/views/dashboardStyle.jsx";

const Moment = require('moment');

const initialState = {
  tableData: [],
  tableHead: [],
  loading: true
};

const measurementHead = [
  { label: 'Hora da Medição', key: 'date' },
  { label: 'Temperatura (ºC)', key: 'temperature' },
  { label: 'Umidade (%)', key: 'humidity' },
  { label: 'Molhamento Foliar (%)', key: 'leafWetness' }
];

class ReportDetails extends React.PureComponent {
  constructor() {
    super();
    this.userService = new UserService();
    this.reportService = new ReportsService();
    this.state = initialState;
  }

  componentDidMount = () => {
    const { report, id, date } = this.props.match.params;

    switch (report) {
      case 'measurements':
        this.setState({ tableHead: measurementHead });
        this.getMeasurementReport(id, date);
        break;

      case 'valves':
        this.getMeasurementReport(id, date);
        break;

      default:
        break;
    }
  };

  getMeasurementReport = async (location_id, date) => {
    this.setState({ loading: true });

    const formData = new FormData();

    formData.append("location_id", location_id);
    formData.append("date", Moment(date).format("YYYY-MM-DD"));

    await this.reportService.measurementReportDetails(formData)
      .then(({ data }) => {

        const result = [];

        data.map(item => {
          result.push({
            date: Moment(item.created_at).format("HH:mm:ss"),
            humidity: `${item.humidity.toFixed(2)}%`,
            leafWetness: `${item.leafWetness.toFixed(2)}%`,
            temperature: `${item.temperature.toFixed(2)}ºC`,
          });
          return true;
        });

        this.setState({ loading: false, tableData: result });
      })
      .catch((err) => {
        // console.log(err);
        this.setState({ loading: false });
        this.props.showNotification('Não foi possível gerar o relatório.', 'danger', 'tr');
      })
  };

  goBack = () => {
    const { report } = this.props.match.params;
    this.props.history.replace(`/reports/${report}`);
  };

  render() {
    const { classes } = this.props;
    const { date } = this.props.match.params;
    const { tableData, tableHead } = this.state;
    return (
      <Grid container alignItems="center" justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success" icon>
              <CardIcon color="success">
                <Button type="button" color="transparent" className={classes.cardIconButton} onClick={this.goBack}>
                  <Tooltip title="Voltar" enterDelay={300} placement="bottom" classes={{ tooltip: classes.tooltip }}>
                    <ArrowBack />
                  </Tooltip>
                </Button>
              </CardIcon>
              <h3 className={classes.cardTitle}>{`Relatório do dia ${Moment(date).format('D [de] MMMM [de] YYYY')}`}</h3>
            </CardHeader>
            <CardBody style={{ paddingTop: "0px" }} align="center">
              {
                this.state.loading
                  ? <Loading />
                  :
                  <DataTable
                    tableHeaderColor="success"
                    tableHead={tableHead || []}
                    tableData={tableData || []}
                    openModal={this.openEditModal}
                    deleteItem={this.handleOpenConfirmDelete}
                  />
              }
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    );
  }
}

ReportDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

ReportDetails = withStyles(dashboardStyle)(ReportDetails);


export default withAdmin(ReportDetails);
