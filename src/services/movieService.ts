import axios from 'axios';

export default {

    //get all available movies we show
    getMovies: () : Promise<any> => {
        return axios.get('http://localhost:8081/getAllMovies');
    }
}