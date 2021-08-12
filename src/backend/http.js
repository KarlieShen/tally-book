import Axios from 'axios';
import https from 'https';

const BASE_URL = '/';
const http = Axios.create({
  timeout: 60 * 1000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  })
});

http.interceptors.request.use((config) => {
  console.log('request--->', JSON.stringify({
    url: config.url,
    data: config.data,
  }));
  const axiosConfig = config;
  axiosConfig.baseUrl = BASE_URL;
  axiosConfig.withCredentials = true;
  axiosConfig.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...config.headers
  };
  return axiosConfig;
});

http.interceptors.response.use((response) => {
  const { status, data } = response;
  console.log('response--->', JSON.stringify({
    status,
    data,
  }));
  return response;
});

export const post = async (
  url,
  data = {},
) => {
  const response = await http.post(url, data, {}).catch((e) => {
    console.log('err');
    return Promise.reject(e);
  });
  return response.data;
}

export const get = async (
  url,
  data = {},
) => {
  const response = await http.get(url, {
    params: data,
  }).catch((e) => {
    console.log('err');
    return Promise.reject(e);
  });
  return response.data;
}
