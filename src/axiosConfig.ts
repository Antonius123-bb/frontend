import axios from 'axios';
import { USER_COOKIE_AUTH_CODE, USER_COOKIE_INFO } from "./constants";

axios.interceptors.request.use(function (config) {
    
    //send the authtoken if available to show that a user is registered
    const userdata = JSON.parse(localStorage.getItem(USER_COOKIE_AUTH_CODE));
    if(userdata && userdata.authcode) {
        config.headers.authcode = userdata.authcode
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