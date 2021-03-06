import axios from 'axios';

export default {    

    //create a new presentation
    createPresentation: (filmid, saalid, basis_preis, vorstellungsbeginn) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/admin/neue-vorstellung', {
            filmid, saalid, basis_preis, vorstellungsbeginn
        });
    },

    //get all available rooms (Kinosäle)
    getRooms: () : Promise<any> => {
        return axios.get('https://dhbw-kino.de:4567/saele');
    }
}