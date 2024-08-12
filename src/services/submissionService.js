import { httpClient } from "../axios/httpClient";

export const getSubmission = (id) => {
  return httpClient.get(`submissions/${id}`);
};
export const createSubmission = (body) => {
  return httpClient.post("submissions", body);
};
