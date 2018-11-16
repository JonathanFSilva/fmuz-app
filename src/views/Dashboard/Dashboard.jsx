import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
// core components
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
// icons
import humidity from "../../assets/img/icons/humidity.svg";
import leaf from "../../assets/img/icons/leaf.svg";
import thermometer from "../../assets/img/icons/thermometer.svg";

import LineChart from "./LineChart";
import withAuthentication from "../../hocs/withAuthentication";
import MeasurementService from "../../services/measurement";
import NodeService from "../../services/nodes";

import dashboardStyle from "../../assets/jss/fruticulture/views/dashboardStyle.jsx";

const Moment = require("moment");

const initialState = {
  index: 1,
  title: "Temperatura",
  color: "danger",
  nodes: [{ id: undefined, mac: "", location: "" }],
  humiditys: [{ meta: "", value: undefined }],
  temperatures: [{ meta: "", value: undefined }],
  leafWetness: [{ meta: "", value: undefined }],
  activeNode: 0
};

class Dashboard extends React.PureComponent {
  constructor() {
    super();
    this.measurementService = new MeasurementService();
    this.nodeService = new NodeService();
    this.state = initialState;
  }

  componentDidMount = async () => {
    await this.nodeService.getAll().then(({ data }) => {
      const nodes = [];

      data.forEach(item => {
        nodes.push({ id: item.id, mac: item.mac_address, location: item.name });
      });

      this.setState({ nodes });
    });

    this.getMeasurementList();
    setInterval(this.getMeasurementList, 60000);
  };

  getMeasurementList = async (qtde = 30) => {
    const id = this.state.nodes[this.state.activeNode].id;

    await this.measurementService
      .getMeasurementList(id, qtde)
      .then(({ data }) => {
        // console.log(data);
        this.setDataChart(data);
      });
  };

  setDataChart = data => {
    const labels = [];

    const humiditys = [];
    const temperatures = [];
    const leafWetness = [];

    data.forEach(item => {
      labels.push(item.created_at);
      humiditys.push({
        meta: Moment(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
        value: item.humidity
      });
      temperatures.push({
        meta: Moment(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
        value: item.temperature
      });
      leafWetness.push({
        meta: Moment(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
        value: item.leafWetness
      });
    });

    this.setState({ labels, humiditys, temperatures, leafWetness });
  };

  handleChangeChart = (index, title, color) => {
    this.setState({ index, title, color });
  };

  handleNext = () => {
    this.setState({ activeNode: this.state.activeNode + 1 }, () => {
      this.getMeasurementList();
    });
  };

  handleBack = () => {
    this.setState({ activeNode: this.state.activeNode - 1 }, () => {
      this.getMeasurementList();
    });
  };

  render() {
    const { classes } = this.props;
    const {
      labels,
      temperatures,
      humiditys,
      leafWetness,
      index,
      title,
      color,
      nodes,
      activeNode
    } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader
                style={{ paddingBottom: "0px" }}
                color="danger"
                stats
                icon
              >
                <Tooltip
                  title="Ver gráfico de Temperatura"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <CardIcon
                    color="danger"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      this.handleChangeChart(1, "Temperatura", "danger")
                    }
                  >
                    <img
                      alt="thermometer-icon"
                      className="icon"
                      src={thermometer}
                    />
                  </CardIcon>
                </Tooltip>
                <p className={classes.cardCategory}>Temperatura</p>
                <h3 className={classes.cardTitle}>
                  {!!temperatures
                    ? temperatures[temperatures.length - 1].value
                    : ""}
                  ºC
                </h3>
              </CardHeader>
              <CardFooter />
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader color="info" stats icon>
                <Tooltip
                  title="Ver gráfico de Umidade"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <CardIcon
                    color="info"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleChangeChart(2, "Umidade", "info")}
                  >
                    <img alt="humidity-icon" className="icon" src={humidity} />
                  </CardIcon>
                </Tooltip>
                <p className={classes.cardCategory}>Umidade</p>
                <h3 className={classes.cardTitle}>
                  {!!humiditys ? humiditys[humiditys.length - 1].value : ""}%
                </h3>
              </CardHeader>
              <CardFooter />
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader color="success" stats icon>
                <Tooltip
                  title="Ver gráfico de Molhamento Foliar"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <CardIcon
                    color="success"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      this.handleChangeChart(3, "Molhamento Foliar", "success")
                    }
                  >
                    <img alt="leaf-wetness-icon" className="icon" src={leaf} />
                  </CardIcon>
                </Tooltip>
                <p className={classes.cardCategory}>Molhamento</p>
                <h3 className={classes.cardTitle}>
                  {!!leafWetness
                    ? leafWetness[leafWetness.length - 1].value
                    : ""}
                  %
                </h3>
              </CardHeader>
              <CardFooter />
            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color={color}>
                <center>
                  <h3 className={classes.cardTitleWhite}>{title}</h3>
                </center>
                {index === 1 && !!temperatures ? (
                  <LineChart
                    data={{ labels, series: [temperatures] } || {}}
                    labelY="ºC"
                    serie="Temperatura"
                  />
                ) : null}
                {index === 2 && !!humiditys ? (
                  <LineChart
                    data={{ labels, series: [humiditys] } || {}}
                    labelY="%"
                    serie="Umidade"
                  />
                ) : null}
                {index === 3 && !!leafWetness ? (
                  <LineChart
                    data={{ labels, series: [leafWetness] } || {}}
                    labelY="%"
                    serie="Molhamento Foliar"
                  />
                ) : null}
              </CardHeader>
              <CardBody>
                <p className={classes.cardCategory}>Localização</p>
                <h4 className={classes.cardTitle}>
                  {nodes[activeNode].location || ""}
                </h4>
              </CardBody>
              <CardFooter chart>
                <GridItem xs={12} sm={12} md={12}>
                  <MobileStepper
                    variant="dots"
                    steps={nodes.length}
                    position="static"
                    activeStep={activeNode}
                    nextButton={
                      // <Tooltip title="Próximo nó" placement="bottom" classes={{ tooltip: classes.tooltip }}>
                      <Button
                        size="small"
                        onClick={this.handleNext}
                        disabled={activeNode === nodes.length - 1}
                      >
                        <KeyboardArrowRight />
                      </Button>
                      // </Tooltip>
                    }
                    backButton={
                      // <Tooltip title="Nó Anterior" placement="bottom" classes={{ tooltip: classes.tooltip }}>
                      <Button
                        size="small"
                        onClick={this.handleBack}
                        disabled={activeNode === 0}
                      >
                        <KeyboardArrowLeft />
                      </Button>
                      // </Tooltip>
                    }
                    style={{
                      backgroundColor: "transparent"
                    }}
                    classes={{
                      dotActive: "dot-active"
                    }}
                  />
                </GridItem>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

Dashboard = withStyles(dashboardStyle)(Dashboard);

export default withAuthentication(Dashboard);
