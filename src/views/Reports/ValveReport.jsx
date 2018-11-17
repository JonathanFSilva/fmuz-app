import React from "react";
import PropTypes from "prop-types";
import FormData from "form-data";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
// import Tooltip from "@material-ui/core/Tooltip";
import AddAlert from "@material-ui/icons/AddAlert";
import Search from "@material-ui/icons/Search";
// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import DataTable from "../../components/Table/DataTable";
import DatePicker from "../../components/DatePicker/DatePicker";
import GridItem from "../../components/Grid/GridItem";
import Loading from "../../components/Loading/Loading";
import SelectInput from "../../components/SelectInput/SelectInput";
import Snackbar from "../../components/Snackbar/Snackbar";

import FormValidator from "../../validations/FormValidator";
import ReportService from "../../services/reports";
import LocationService from "../../services/locations.js";
import withAuthentication from "../../hocs/withAuthentication";

import dashboardStyle from "../../assets/jss/fruticulture/views/dashboardStyle.jsx";

const Moment = require("moment");

const initialState = {
  beginDate: Moment(),
  endDate: Moment(),
  valvesReport: [],
  locations: [],
  location_id: "",
  loading: false,
  notificationOpen: false,
  notificationColor: "danger",
  notificationPlace: "tr",
  notificationMessage: ""
};

class MeasurementReport extends React.PureComponent {
  constructor() {
    super();
    this.locationService = new LocationService();
    this.reportService = new ReportService();
    this.validator = new FormValidator([
      {
        field: "beginDate",
        method: "isEmpty",
        validWhen: false,
        message: "Campo obrigatório"
      },
      {
        field: "endDate",
        method: "isEmpty",
        validWhen: false,
        message: "Campo obrigatório"
      },
      {
        field: "endDate",
        method: this.validEndDate,
        validWhen: true,
        message: "Data final deve ser maior ou igual a data de inicio"
      },
      {
        field: "location_id",
        method: "isEmpty",
        validWhen: false,
        message: "Campo obrigatório"
      }
    ]);
    this.state = { ...initialState, validation: this.validator.valid() };
    this.submited = false;
  }

  componentWillMount = async () => {
    await this.getAllLocations();

    const params = JSON.parse(localStorage.getItem("@App:report"));

    if (!!params) {
      await this.setState({
        location_id: params.location_id,
        endDate: Moment(params.endDate),
        beginDate: Moment(params.beginDate)
      });
    }

    this.filter();
  };

  validEndDate = (endDate, state) =>
    Moment(endDate).diff(state.beginDate, "days") >= 0;

  handleLocationChange = event => {
    event.preventDefault();

    this.setState({ location_id: event.target.value });
  };

  handleBeginDateChange = date => {
    this.setState({ beginDate: date });
  };

  handleEndDateChange = date => {
    this.setState({ endDate: date });
  };

  showNotification = (message, color, place = "tr") => {
    this.setState({
      notificationOpen: true,
      notificationMessage: message,
      notificationColor: color,
      notificationPlace: place
    });

    setTimeout(() => {
      this.setState({ notificationOpen: false, notificationMessage: "" });
    }, 6000);
  };

  filter = async () => {
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submited = true;

    if (validation.isValid) {
      this.setState({ loading: true });

      const { location_id, beginDate, endDate } = this.state;

      const formData = new FormData();

      formData.append("location_id", location_id);
      formData.append(
        "beginDate",
        `${Moment(beginDate).format("YYYY-MM-DD")} 00:00:00`
      );
      formData.append(
        "endDate",
        `${Moment(endDate).format("YYYY-MM-DD")} 23:59:59`
      );

      this.saveReportParams();

      await this.reportService
        .valvesReport(formData)
        .then(({ data }) => {
          this.submited = false;
          console.log(data);
          const result = [];

          data.map(item => {
            result.push({
              date: Moment(item.created_at).format("DD/MM/YYYY"),
              activations: item.activations,
              duration: item.duration
            });
            return true;
          });

          this.setState({ loading: false, valvesReport: result });
        })
        .catch(err => {
          // console.log(err);
          this.setState({ loading: false });
          this.showNotification(
            "Não foi possível gerar o relatório.",
            "danger",
            "tr"
          );
        });
    }
  };

  getAllLocations = async () => {
    await this.locationService.getAll().then(({ data }) => {
      const locations = [];

      data.forEach(item => {
        locations.push([item.id, item.name]);
      });

      this.setState({ locations, location_id: locations[0][0] });
    });
  };

  showDetails = prop => {
    const id = this.state.location_id;

    const date = Moment(prop.date, "DD/MM/YYYY").format("YYYY-MM-DD");

    const url = `/reports/valves/${id}/${date}`;
    this.props.history.replace(url);
  };

  saveReportParams = () => {
    const { beginDate, endDate, location_id } = this.state;

    localStorage.setItem(
      "@App:report",
      JSON.stringify({
        endDate: Moment(endDate).format("YYYY-MM-DD"),
        beginDate: Moment(beginDate).format("YYYY-MM-DD"),
        location_id: location_id
      })
    );
  };

  render() {
    // const { classes } = this.props;
    const {
      beginDate,
      endDate,
      location_id,
      locations,
      valvesReport
    } = this.state;
    const validation = this.submited
      ? this.validator.validate(this.state)
      : this.state.validation;

    return (
      <div>
        <Snackbar
          place={this.state.notificationPlace}
          color={this.state.notificationColor}
          message={this.state.notificationMessage}
          icon={AddAlert}
          open={this.state.notificationOpen}
          closeNotification={() => this.setState({ notificationOpen: false })}
          close
        />
        <Card>
          <CardBody>
            <Grid container justify="flex-start">
              <GridItem xs={12} sm={4} md={3}>
                <DatePicker
                  id="beginDate"
                  labelText="Data de Inicio"
                  error={validation.beginDate.isInvalid}
                  helperText={validation.beginDate.message}
                  formControlProps={{
                    error: validation.beginDate.isInvalid,
                    required: true,
                    fullWidth: true
                  }}
                  inputProps={{
                    value: beginDate,
                    onChange: this.handleBeginDateChange,
                    type: "text"
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={4} md={3}>
                <DatePicker
                  id="endDate"
                  labelText="Data Final"
                  error={validation.endDate.isInvalid}
                  helperText={validation.endDate.message}
                  formControlProps={{
                    error: validation.endDate.isInvalid,
                    required: true,
                    fullWidth: true
                  }}
                  inputProps={{
                    value: endDate,
                    onChange: this.handleEndDateChange,
                    type: "text"
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={4} md={3}>
                <SelectInput
                  id="location_id"
                  labelText="Localização"
                  error={validation.location_id.isInvalid}
                  helperText={validation.location_id.message}
                  formControlProps={{
                    error: validation.location_id.isInvalid,
                    required: true,
                    fullWidth: true
                  }}
                  inputProps={{
                    value: location_id,
                    onChange: this.handleLocationChange,
                    type: "text"
                  }}
                  options={locations}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={3}>
                <Grid container justify="center" alignContent="center">
                  <GridItem>
                    {/* <Tooltip title="Gerar relatório" placement="top" classes={{ tooltip: classes.tooltip }}> */}
                    <Button
                      color="success"
                      style={{ marginTop: "27px" }}
                      onClick={this.filter}
                    >
                      <Search />
                    </Button>
                    {/* </Tooltip> */}
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ paddingTop: "0px" }} align="center">
            {this.state.loading ? (
              <Loading />
            ) : (
              <DataTable
                action={["view"]}
                tableHeaderColor="success"
                tableHead={[
                  { label: "Data", key: "date" },
                  { label: "Quantidade de acionamentos", key: "activations" },
                  { label: "Total de tempo ativo", key: "duration" }
                ]}
                tableData={valvesReport || []}
                showItem={this.showDetails}
              />
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

MeasurementReport.propTypes = {
  classes: PropTypes.object.isRequired
};

MeasurementReport = withStyles(dashboardStyle)(MeasurementReport);

export default withAuthentication(MeasurementReport);
