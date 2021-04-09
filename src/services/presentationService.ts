import axios from 'axios';
import { API_URL } from '../constants';

export default {
    //get all available presentations
    getAllPresentations: () : Promise<any> => {
        return axios.get(API_URL + '/getAllPresentations');
    },

    //get the details of a presentation by his ID
    getPresentationById: (id) : Promise<any> => {
        return axios.get(API_URL + '/getPresentationById/' + id);
    },

    bookSeats: (seats, presentationId, userId, payment) : Promise<any> => {
        return axios.post(API_URL + '/bookSeats', {
            seats, presentationId, userId, payment
        });
    },
    
    //create a new presentation
    createPresentation: (presentationStart, movieId, basicPrice, roomId, threeD ) : Promise<any> => {
        return axios.post(API_URL + '/createPresentation', {
            presentationStart, movieId, basicPrice, roomId, threeD
        });
    },

    updatePresentationById: (id, presentationStart, movieId, threeD) : Promise<any> => {
        return axios.post(API_URL + '/updatePresentationById', {
            id, data: {presentationStart, movieId, threeD}
        });
    },

    deletePresentationById: (id) : Promise<any> => {
        return axios.post(API_URL + '/deletePresentationById', {
            id
        });
    },

    //to be changed
    getPresentationByMovieId: (id) : Promise<any> => {
        return axios.get(API_URL + '/getPresentationByMovieId/' + id);
    },
}