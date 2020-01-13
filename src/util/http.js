import axios from "axios";
var instance = axios.create({
    baseURL: process.env.NODE_ENV == 'development' ? '/api' : '',
    timeout: 80000
});

export default instance;
