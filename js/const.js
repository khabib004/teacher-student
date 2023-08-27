const ENDPOINT = "https://64e8e8c399cf45b15fe04fe2.mockapi.io/";
const LIMIT = 6;


const request = axios.create( {
  baseURL: ENDPOINT,
  zzimeout: 10000,
} );
// export { ENDPOINT, LIMIT };