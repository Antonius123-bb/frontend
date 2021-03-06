import axios from 'axios';

export default {

    //get all available movies we show
    getMovies: () : Promise<any> => {
        return axios.get('https://dhbw-kino.de:4567/get-movies');
    }
}