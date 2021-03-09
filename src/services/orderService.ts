import axios from 'axios';
import { API_URL } from '../constants';

export default {    

    cancelOrder: (id) : Promise<any> => {
        return axios.post(API_URL + '/cancelOrder', {
            id
        });
    },

    getOrdersByUser: (userId) : Promise<any> => {
        return axios.get(API_URL + '/getOrdersByUser' + userId);
    },

    getOrderById: (id) : Promise<any> => {
        return axios.get(API_URL + '/getOrderById' + id);
    },
}