import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import MobileStepper from "@material-ui/core/MobileStepper";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Accessibility from "@material-ui/icons/Accessibility";
import Button from "@material-ui/core/Button";
import DateRange from "@material-ui/icons/DateRange";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Store from "@material-ui/icons/Store";
// core components
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import LineChart from "./LineChart";
import withAuthentication from "hocs/withAuthentication";
import MeasurementService from "services/measurement";
import NodeService from "services/nodes";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";


const Moment = require('moment');

const initialState = {
  index: 1,
  title: 'Temperatura',
  color: 'danger',
  nodes: [{ id: undefined, mac: '', location: '' }],
  humiditys: [{ meta: '', value: undefined }],
  temperatures: [{ meta: '', value: undefined }],
  activeNode: 0,
}

class Dashboard extends React.PureComponent {
  constructor() {
    super();
    this.measurementService = new MeasurementService();
    this.nodeService = new NodeService();
    this.state = initialState;
  }

  componentDidMount = async () => {
    await this.nodeService.getAll()
      .then(({ data }) => {
        const nodes = [];

        data.forEach((item) => {
          nodes.push({ id: item.id, mac: item.mac_address, location: item.name });
        });

        this.setState({ nodes });
      })

    this.getLastHour();
  };

  // componentDidMount = async (id = 2) => {
  //   await this.measurementService.getLastHour(id)
  //     .then(({ data }) => {
  //       this.setDataChart(data);
  //     })
  //     .catch((err) => {
  //       // console.log(err);
  //     })
  // };
  getLastHour = async () => {
    const id = this.state.nodes[this.state.activeNode].id;

    await this.measurementService.getLastHour(id)
      .then(({ data }) => {
        this.setDataChart(data);
      })
  };

  setDataChart = (data) => {
    const labels = [];

    const humiditys = [];
    const temperatures = [];

    data.forEach((item) => {
      labels.push(item.created_at);
      humiditys.push({ meta: Moment(item.created_at).format('HH:mm:ss'), value: item.humidity });
      temperatures.push({ meta: Moment(item.created_at).format('HH:mm:ss'), value: item.temperature });
    });

    this.setState({ labels, humiditys, temperatures });
    // this.setState({ labels, humiditys, temperatures }, () => { console.log(this.state) })
  }

  handleChangeChart = (index, title, color) => {
    this.setState({ index, title, color });
  };

  handleNext = () => {
    this.setState({ activeNode: this.state.activeNode + 1 }, () => { this.getLastHour() });
  };

  handleBack = () => {
    this.setState({ activeNode: this.state.activeNode - 1 }, () => { this.getLastHour() });
  };

  render() {
    const { classes } = this.props;
    const { labels, temperatures, humiditys, index, title, color, nodes, activeNode } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <Tooltip title="Ver gráfico de Temperatura">
                  <CardIcon
                    color="danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleChangeChart(1, 'Temperatura', 'danger')}
                  >
                    <Icon>content_copy</Icon>
                  </CardIcon>
                </Tooltip>
                <p className={classes.cardCategory}>Temperatura</p>
                <h3 className={classes.cardTitle}>{temperatures[temperatures.length - 1].value || ''}ºC</h3>
              </CardHeader>
              <CardFooter>
                {/* <div className={classes.stats}>
                  <Danger>
                    <Warning />
                  </Danger>
                  Get more space
                </div> */}
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <Tooltip title="Ver gráfico de Umidade">
                  <CardIcon
                    color="info"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleChangeChart(2, 'Umidade', 'info')}
                  >
                    <Store />
                  </CardIcon>
                </Tooltip>
                <p className={classes.cardCategory}>Umidade</p>
                <h3 className={classes.cardTitle}>{humiditys[humiditys.length - 1].value || ''}%</h3>
              </CardHeader>
              <CardFooter>
                {/* <div className={classes.stats}>
                  <DateRange />
                  Last 24 Hours
                </div> */}
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <Tooltip title="Ver gráfico de Luminosidade">
                  <CardIcon
                    color="warning"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleChangeChart(3, 'Luminosidade', 'warning')}
                  >
                    <Icon>info_outline</Icon>
                  </CardIcon>
                </Tooltip>
                <p className={classes.cardCategory}>Luminosidade</p>
                <h3 className={classes.cardTitle}>{temperatures[temperatures.length - 1].value || ''}ºC</h3>
              </CardHeader>
              <CardFooter>
                {/* <div className={classes.stats}>
                  <LocalOffer />
                  Tracked from Github
                </div> */}
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <Tooltip title="Ver gráfico de Molhamento Foliar">
                  <CardIcon
                    color="success"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleChangeChart(4, 'Molhamento Foliar', 'success')}
                  >
                    <Accessibility />
                  </CardIcon>
                </Tooltip>
                <p className={classes.cardCategory}>Molhamento</p>
                <h3 className={classes.cardTitle}>{humiditys[humiditys.length - 1].value || ''}%</h3>
              </CardHeader>
              <CardFooter>
                {/* <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div> */}
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color={color}>
                <center><h3 className={classes.cardTitleWhite}>{title}</h3></center>
                {
                  index === 1 && !!temperatures
                    ? <LineChart data={{ labels, series: [temperatures] } || {}} labelY="ºC" serie="Temperatura" />
                    : null
                }
                {
                  index === 2 && !!humiditys
                    ? <LineChart data={{ labels, series: [humiditys] } || {}} labelY="%" serie="Umidade" />
                    : null
                }
                {
                  index === 3 && !!temperatures
                    ? <LineChart data={{ labels, series: [temperatures] } || {}} labelY="%" serie="Luminosidade" />
                    : null
                }
                {
                  index === 4 && !!humiditys
                    ? <LineChart data={{ labels, series: [humiditys] } || {}} labelY="%" serie="Molhamento Foliar" />
                    : null
                }
              </CardHeader>
              <CardBody>
                <p className={classes.cardCategory}>Localização</p>
                <h4 className={classes.cardTitle}>{nodes[activeNode].location || ''}</h4>
              </CardBody>
              <CardFooter chart>
                <GridItem xs={12} sm={12} md={12}>
                  <MobileStepper
                    variant="dots"
                    steps={nodes.length}
                    position="static"
                    activeStep={activeNode}
                    nextButton={
                      <Tooltip title="Próximo nó">
                        <Button size="small" onClick={this.handleNext} disabled={activeNode === nodes.length - 1}>
                          <KeyboardArrowRight />
                        </Button>
                      </Tooltip>
                    }
                    backButton={
                      <Tooltip title="Nó Anterior">
                        <Button size="small" onClick={this.handleBack} disabled={activeNode === 0}>
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                    }
                    style={{
                      backgroundColor: "transparent",
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
      </div >
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

Dashboard = withStyles(dashboardStyle)(Dashboard);

export default withAuthentication(Dashboard);

