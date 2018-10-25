import React from "react";
import PropTypes from "prop-types";
import FormData from "form-data";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
// import Tooltip from "@material-ui/core/Tooltip";

import Search from "@material-ui/icons/Search";
// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import DataTable from "../../components/Table/DataTable";
import DatePicker from "../../components/DatePicker/DatePicker";
import SelectInput from "../../components/SelectInput/SelectInput";
import GridItem from "../../components/Grid/GridItem.jsx";

import FormValidator from "../../validations/FormValidator";
import ReportService from "../../services/reports";
import LocationService from "../../services/locations.js";
import withAuthentication from "../../hocs/withAuthentication";

import dashboardStyle from "../../assets/jss/fruticulture/views/dashboardStyle.jsx";


const Moment = require('moment');


const initialState = {
  beginDate: Moment(),
  endDate: Moment(),
  location_id: '',
  locations: [],
  measurementReport: [],
};


class MeasurementReport extends React.PureComponent {
  constructor() {
    super();
    this.locationService = new LocationService();
    this.reportService = new ReportService();
    this.validator = new FormValidator([
      {
        field: 'beginDate',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      },
      {
        field: 'endDate',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      },
      {
        field: 'endDate',
        method: this.validEndDate,
        validWhen: true,
        message: 'Data final deve ser maior ou igual a data de inicio'
      },
      {
        field: 'location_id',
        method: 'isEmpty',
        validWhen: false,
        message: 'Campo obrigatório'
      }
    ]);
    this.state = { ...initialState, validation: this.validator.valid() };
    this.submited = false;
  };

  componentDidMount = async () => {
    await this.getAllLocations();

    const params = JSON.parse(localStorage.getItem('@App:report'));

    if (!!params) {
      await this.setState(
        {
          location_id: params.location_id,
          endDate: Moment(params.endDate),
          beginDate: Moment(params.beginDate)
        }
      );
    }

    this.filter();
  };

  validEndDate = (endDate, state) => (Moment(endDate).diff(state.beginDate, 'days') >= 0);

  handleLocationChange = (event) => {
    event.preventDefault();

    this.setState({ location_id: event.target.value });
  };

  handleBeginDateChange = (date) => {
    this.setState({ beginDate: date });
  };

  handleEndDateChange = (date) => {
    this.setState({ endDate: date });
  };

  filter = async () => {
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submited = true;

    if (validation.isValid) {
      const { location_id, beginDate, endDate } = this.state;

      const formData = new FormData();

      formData.append("location_id", location_id);
      formData.append("beginDate", Moment(beginDate).format("YYYY-MM-DD HH:mm"));
      formData.append("endDate", Moment(endDate).format("YYYY-MM-DD HH:mm"));

      this.saveReportParams();

      await this.reportService.measurementReport(formData)
        .then(({ data }) => {
          this.submited = false;

          const result = [];

          data.map(item => {
            result.push({
              date: Moment(item.created_at).format("DD/MM/YYYY"),
              humidity: `${item.humidity.toFixed(2)}%`,
              leafWetness: `${item.leafWetness.toFixed(2)}%`,
              temperature: `${item.temperature.toFixed(2)}ºC`,
            });
            return true;
          });

          this.setState({ measurementReport: result });
        })
        .catch((err) => {
          console.log(err);
          // this.props.showNotification('Não foi possível gerar o relatório.', 'danger', 'tr');
        })
    }
  };

  getAllLocations = async () => {
    await this.locationService.getAll()
      .then(({ data }) => {
        const locations = [];

        data.forEach((item) => {
          locations.push([item.id, item.name]);
        });

        this.setState({ locations, location_id: locations[0][0] });
      });
  };

  showDetails = (prop) => {
    const id = this.state.location_id;

    const date = Moment(prop.date, "DD/MM/YYYY").format("YYYY-MM-DD");

    const url = `/reports/measurements/${id}/${date}`;
    this.props.history.replace(url);
  };

  saveReportParams = () => {
    const { beginDate, endDate, location_id } = this.state;

    localStorage.setItem('@App:report', JSON.stringify(
      {
        endDate: Moment(endDate).format("YYYY-MM-DD"),
        beginDate: Moment(beginDate).format("YYYY-MM-DD"),
        location_id: location_id
      }
    ));
  };

  render() {
    // const { classes } = this.props;
    const { beginDate, endDate, location_id, locations, measurementReport } = this.state;
    const validation = this.submited ? this.validator.validate(this.state) : this.state.validation;

    return (
      <div>
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
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: beginDate,
                    onChange: this.handleBeginDateChange,
                    type: "text",
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
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: endDate,
                    onChange: this.handleEndDateChange,
                    type: "text",
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
                    fullWidth: true,
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
                    <Button color="success" style={{ marginTop: '27px' }} onClick={this.filter}>
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
          <CardBody style={{ paddingTop: "0px" }}>
            <DataTable
              action={["view"]}
              tableHeaderColor="success"
              tableHead={[
                { label: 'Data', key: 'date' },
                { label: 'Temperatura (ºC)', key: 'temperature' },
                { label: 'Umidade (%)', key: 'humidity' },
                { label: 'Molhamento Foliar (%)', key: 'leafWetness' }
              ]}
              tableData={measurementReport || []}
              showItem={this.showDetails}
            />
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
