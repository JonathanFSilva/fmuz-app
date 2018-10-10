import api from "./api.js"

const url = 'reports';

class ReportService {

  measurementReport = (data) => { return api.post(`${url}/measurements`, data) };

}

export default ReportService;
