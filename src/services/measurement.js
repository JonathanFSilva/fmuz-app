import api from "./api.js"

const url = 'measurements';

class MeasurementService {

  getLastHour = (id) => { return api.get(`${url}/${id}`) };

}

export default MeasurementService;
