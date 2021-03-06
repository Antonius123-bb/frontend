import axios from 'axios';
import { USER_COOKIE_NAME } from "./constants";

axios.interceptors.request.use(function (config) {
    
    //send the authtoken if available to show that a user is registered
    const userdata = JSON.parse(localStorage.getItem(USER_COOKIE_NAME));
    if(userdata && userdata.authToken) {
        config.headers.Auth = userdata.authToken
    }

    return config;
}, function (error) {

    return Promise.reject(error);
})

axios.interceptors.response.use(function (config) {
    
    return config;
}, function (error) {

    return Promise.reject(error);
})