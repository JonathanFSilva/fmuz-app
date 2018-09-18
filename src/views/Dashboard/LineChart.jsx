import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import "chartist-plugin-tooltips/dist/chartist-plugin-tooltip.css";
import ChartistGraph from "react-chartist";

var Chartist = require("chartist");
var Moment = require("moment");

require("chartist-plugin-tooltips");


const LineChart = ({ ...props }) => {
  const { data, labelX, labelY, serie } = props;

  const options = {
    axisY: {
      offset: 50,
      labelInterpolationFnc: function (value) {
        return `${value}${labelY}`;
      }
    },
    axisX: {
      labelInterpolationFnc: function (value) {
        return Moment(value).format('HH:mm:ss');
      }
    },
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 1
    }),
    plugins: [
      Chartist.plugins.tooltip({
        anchorToPoint: true,
        transformTooltipTextFnc: function (value) {
          return `${serie}: ${value}${labelY}`;
        }
      })
    ],
    // low: 0,
    // high: 100,
    showArea: true,
    // fullWidth: true,
    chartPadding: {
      top: 20,
      right: 0,
      bottom: 0,
      left: 0
    }
  };

  const responsiveOptions = [
    ['screen and (max-width: 640px)', {
      seriesBarDistance: 5,
      axisX: {
        labelInterpolationFnc: function (value) {
          return Moment(value).format('HH:mm');
        }
      }
    }]
  ];

  const animation = {
    draw: function (data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === "point") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * 80,
            dur: 500,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  };

  return (
    <ChartistGraph
      className="ct-octave"
      data={data}
      type="Line"
      options={options}
      responsiveOptions={responsiveOptions}
      listener={animation}
    />
  );
};

LineChart.propTypes = {
  data: PropTypes.object.isRequired,
  labelY: PropTypes.string,
  labelX: PropTypes.string,
  serie: PropTypes.string
};

export default LineChart;
