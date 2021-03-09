import axios from 'axios';
import { API_URL } from '../constants';

export default {

    registerUser : (name, lastName, pw, email) : Promise<any> => {
        return axios.post(API_URL + '/registerUser', {
            name, lastName, pw, email
        });
    },

    getUserById: (id) : Promise<any> => {
        return axios.get(API_URL + '/getUserById/' + id);
    },

    updateUserById : (data, id) : Promise<any> => {
        return axios.post(API_URL + '/updateUserById', {
            data, id
        });
    },

    validateUser : (pw, email) : Promise<any> => {
        return axios.post(API_URL + '/validateUser', {
            pw, email
        });
    },

    addAdressByUserId : (id) : Promise<any> => {
        return axios.post(API_URL + '/addAdressByUserId', {
            id
        });
    }
}