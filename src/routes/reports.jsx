import MeasurementReportPage from "../views/Reports/MeasurementReport.jsx";
// import ValveReportPage from "../views/Reports/ValveReport.jsx";
import ReportDetails from "../views/Reports/ReportDetails.jsx";

const ReportsRoutes = [
  {
    path: "/reports/:report/:id/:date",
    navbarName: "Relatório diário",
    component: ReportDetails,
  },
  {
    path: "/reports/measurements",
    sidebarName: "Medições",
    navbarName: "Relatório de Medições",
    component: MeasurementReportPage,
  },
  // {
  //   path: "/reports/valves",
  //   sidebarName: "Válvulas",
  //   navbarName: "Relatório de válvulas",
  //   component: ValveReportPage,
  // },
];

export default ReportsRoutes;
