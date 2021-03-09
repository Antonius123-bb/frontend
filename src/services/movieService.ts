import axios from 'axios';
import { API_URL } from '../constants';

export default {

    //get all available movies we show
    getAllMovies: () : Promise<any> => {
        return axios.get(API_URL + '/getAllMovies');
    },

    //get movie information by ID
    getMovieById: () : Promise<any> => {
        return axios.get(API_URL + '/getMovieById');
    }
}
