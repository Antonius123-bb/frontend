import axios from 'axios';

export default {
    //get all available presentations
    getPresentations: () : Promise<any> => {
        return axios.get('https://dhbw-kino.de:4567/vorstellungen');
    },

    //get the details of a presentation by his ID
    getPresentationById: (id) : Promise<any> => {
        return axios.get('https://dhbw-kino.de:4567/vorstellung-details/'+id);
    },

    //get all presentations that show a specific movie
    getPresentationByMovieId: (id) : Promise<any> => {
        return axios.get('https://dhbw-kino.de:4567/vorstellungen/'+id);
    },

    placeOrder:(presentationId, email, selectedSeats, paymentType, rechnung) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/placeOrder', {
            presentationId, email, selectedSeats, paymentType, rechnung
        })
    },

    placeOrderWithPaypal:(presentationId, email, selectedSeats, paymentType, rechnung, paypalTransactionId) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/placeOrder', {
            presentationId, email, selectedSeats, paymentType, rechnung, paypalTransactionId
        })
    }
}