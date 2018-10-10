import api from "./api.js"

const url = 'measurements';

class MeasurementService {

  getMeasurementList = (id, qtde) => { return api.get(`${url}/${id}/${qtde}`) };

}

export default MeasurementService;
