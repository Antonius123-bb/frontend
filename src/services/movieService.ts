import axios from 'axios';
import { API_URL } from '../constants';

export default {

    //get all available movies we show
    getMovies: () : Promise<any> => {
        return axios.get(API_URL+'/getAllMovies');
    }
}
