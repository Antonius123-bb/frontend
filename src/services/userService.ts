import axios from 'axios';

export default {
    //route to create a user
    createAccount: (email, name, passwort) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/create-account', {
            email, name, passwort
        });
    },

    //route to login a user
    login: (email, passwort) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/login', {
            email, passwort
        });
    },

    //route to get all infos abbout a user
    getUserinfos: () : Promise<any> => {
        return axios.get('https://dhbw-kino.de:4567/get-userinfos');
    },

    //route to deactivate an user account
    deactivateAccount: (passwort) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/deactivateAccount', 
            passwort
        );
    },

    //route to add adresses to a user
    addAdress: (anrede, name, strasse, plz, stadt, telefonnummer) : Promise<any> => {
        if (telefonnummer != ''){
            return axios.post('https://dhbw-kino.de:4567/add-adress', {
                anrede, name, strasse, plz, stadt, telefonnummer
            });
        } else {
            return axios.post('https://dhbw-kino.de:4567/add-adress', {
                anrede, name, strasse, plz, stadt
            });
        }
    },

    //route to delete a adress from a user
    deleteAddress: (id) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/delete-adress/'+id);
    },

    //route to request an email change
    changeEmailRequest: (passwort, newEmail) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/changeEmail/request', {
            passwort, newEmail
        });
    },

    //route to request an email change
    changeEmailConfirm: (oldEmailKey, newEmailKey) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/changeEmail/confirm', {
            oldEmailKey, newEmailKey
        });
    },

    //route to change the name
    changeName: (name) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/changeName', {
            name
        });
    },

    //route to change the password
    changePassword: (oldPasswort, newPasswort) : Promise<any> => {
        return axios.post('https://dhbw-kino.de:4567/changePasswort', {
            oldPasswort, newPasswort
        });
    }
}