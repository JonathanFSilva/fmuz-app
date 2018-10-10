import api from "./api.js"

const url = 'locations';

class LocationService {

  getAll = () => { return api.get(url) };

  getOne = (id) => { return api.get(`${url}/${id}`) };

  create = (data) => { return api.post(url, data) };

  update = (data) => { return api.put(`${url}/${data.get('id')}`, data) };

  delete = (id) => { return api.delete(`${url}/${id}`) };

}

export default LocationService;
