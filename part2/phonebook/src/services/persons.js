import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAllPersons = () => {
  let request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createPerson = (newPersonObject) => {
  let request = axios.post(baseUrl, newPersonObject);
  return request.then((response) => response.data);
};

const updatePerson = (id, updatedPerson) => {
  let request = axios.put(`${baseUrl}/${id}`, updatedPerson);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  let request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAllPersons, createPerson, updatePerson, deletePerson };
