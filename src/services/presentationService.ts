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
    createPresentation: (presentationStart, presentationEnd, movieId, room, basicPrice) : Promise<any> => {
        return axios.post(API_URL + '/createPresentation', {
            presentationStart, presentationEnd, movieId, room, basicPrice
        });
    },

    updatePresentationById: (id, presentationStart, presentationEnd, movieId, roomId, basicPrice) : Promise<any> => {
        return axios.post(API_URL + '/updatePresentationById', {
            id, presentationStart, presentationEnd, movieId, roomId, basicPrice
        });
    },

    deletePresentationById: (id) : Promise<any> => {
        return axios.post(API_URL + '/deletePresentationById', {
            id
        });
    },

    //to be changed
    getPresentationByMovieId: (id) : Promise<any> => {
        return axios.get(API_URL + '/getPresentationById/' + id);
    },
}