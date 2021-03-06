import api from "./api.js"

const url = 'nodes';

class NodeService {

  getAll = () => { return api.get(url) };

  getOne = (id) => { return api.get(`${url}/${id}`) };

  create = (data) => { return api.post(url, data) };

  update = (data) => { return api.put(`${url}/${data.get('id')}`, data) };

  delete = (id) => { return api.delete(`${url}/${id}`) };

}

export default NodeService;
