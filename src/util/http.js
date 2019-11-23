import axios from "axios";
var instance = axios.create({
    baseURL: process.env.NODE_ENV == 'development' ? '/api' : '',
    timeout: 5000
});
// console.log('===process.env===' + JSON.stringify(process.env));
export default instance;
