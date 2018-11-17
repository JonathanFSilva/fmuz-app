import api from "./api.js";

const url = "reports";

class ReportService {
  measurementReport = data => {
    return api.post(`${url}/measurements`, data);
  };

  measurementReportDetails = data => {
    return api.post(`${url}/measurements/details`, data);
  };

  valvesReport = data => {
    return api.post(`${url}/valves`, data);
  };

  valvesReportDetails = data => {
    return api.post(`${url}/valves/details`, data);
  };
}

export default ReportService;
