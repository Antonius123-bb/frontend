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

    updateUserById : (name, lastName, email, addresses, id) : Promise<any> => {
        return axios.post(API_URL + '/updateUserById', {
            data:{name, lastName, email, addresses}, id
        });
    },

    validateUser : (pw, email) : Promise<any> => {
        return axios.post(API_URL + '/validateUser', {
            pw, email
        });
    },

    addAddressByUserId : (id, name, lastName, street, number, plz, city) : Promise<any> => {
        return axios.post(API_URL + '/addAddressByUserId', {
            id, data: {name, lastName, street, number, plz, city}
        });
    },

    deleteAddressById : (id, addressid) : Promise<any> => {
        return axios.post(API_URL + '/deleteAddressById', {
            id, data: {id: addressid}
        });
    },

    changePassword : (id, oldPassword, newPassword) : Promise<any> => {
        return axios.post(API_URL + '/changePassword', {
            id, data: {oldPassword, newPassword}
        });
    }
}