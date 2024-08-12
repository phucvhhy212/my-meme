import { httpClient } from "../axios/httpClient";

export const getPresignedURL = (fileName) => {
  return httpClient.get(`storage/presignedURL/${fileName}`);
};
export const getObjectVersion = (fileName) => {
  return httpClient.get(`storage/getVersion/${fileName}`);
};
export const uploadFile = (url, file) => {
  return fetch(url, {
      method: 'PUT',
      body: file.file,
      headers: {
          'Content-Type': file.file.type,
      }
  })
}