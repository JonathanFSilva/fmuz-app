import api from "./api.js"

const url = 'reports';

class ReportService {

  measurementReport = (data) => { return api.post(`${url}/measurements`, data) };

  measurementReportDetails = (data) => { return api.post(`${url}/measurements/details`, data) };

}

export default ReportService;
