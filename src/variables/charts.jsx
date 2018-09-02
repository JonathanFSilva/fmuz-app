// ##############################
// // // javascript library for creating charts
// #############################
var Chartist = require("chartist");

// ##############################
// // // variables used to create animation on charts
// #############################
var delays = 80, durations = 500;

// ##############################
// // // Completed Tasks
// #############################

const lineChart = {
  data: {
    labels: ["12am", "3pm", "9am", "6pm", "9pm", "12pm", "3am", "6am", "9am", "9am", "9am", "9am"],
    series: [[30, 50, 50, 30, 80, 40, 20, 90, 70, 60, 10, 100]]
  },
  // data: {
  //   labels: [
  //     "2018-06-11T11:32:17.706Z",
  //     "2018-06-11T11:32:28.425Z",
  //     "2018-06-11T11:32:39.196Z",
  //     "2018-06-11T11:32:49.945Z",
  //     "2018-06-11T11:33:00.721Z",
  //     "2018-06-11T11:33:11.469Z",
  //     "2018-06-11T11:33:22.244Z",
  //     "2018-06-11T11:33:33.043Z",
  //     "2018-06-11T11:33:43.859Z",
  //     "2018-06-11T11:33:54.567Z",
  //     "2018-06-11T11:32:06.873Z",
  //     "2018-06-11T11:30:50.428Z",
  //   ],
  //   series: [
  //     [
  //       { meta: "2018-06-11T11:32:17.706Z", serie: "Umidade", value: 55 },
  //       { meta: "2018-06-11T11:32:28.425Z", serie: "Umidade", value: 54 },
  //       { meta: "2018-06-11T11:32:39.196Z", serie: "Umidade", value: 52 },
  //       { meta: "2018-06-11T11:32:49.945Z", serie: "Umidade", value: 51 },
  //       { meta: "2018-06-11T11:33:00.721Z", serie: "Umidade", value: 50 },
  //       { meta: "2018-06-11T11:33:11.469Z", serie: "Umidade", value: 56 },
  //       { meta: "2018-06-11T11:33:22.244Z", serie: "Umidade", value: 49 },
  //       { meta: "2018-06-11T11:33:33.043Z", serie: "Umidade", value: 49 },
  //       { meta: "2018-06-11T11:33:43.859Z", serie: "Umidade", value: 49 },
  //       { meta: "2018-06-11T11:33:54.567Z", serie: "Umidade", value: 48 },
  //       { meta: "2018-06-11T11:32:06.873Z", serie: "Umidade", value: 56 },
  //       { meta: "2018-06-11T11:30:50.428Z", serie: "Umidade", value: 57 }
  //     ]
  //   ]
  // },
  options: {
    axisY: {
      labelInterpolationFnc: function (value) {
        return value + "%";
      }
    },
    axisX: {
      labelInterpolationFnc: function (value) {
        return value;
      }
    },
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0
    }),
    low: 0,
    high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 20,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  animation: {
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
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};

module.exports = { lineChart };
