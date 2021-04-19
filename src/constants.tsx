//service api url
export const API_URL = 'http://localhost:8081';

//name for user localstorage object
export const USER_COOKIE_INFO = 'userinfo';

export const USER_COOKIE_AUTH_CODE = 'userauth';

//name for cart localstorage object
export const CART_COOKIE = 'cart';

//name for cookie settings localstorage object
export const COOKIE_VALUE = 'allowedCookies';

//all anrede options
export const ANREDE_OPTIONS = [
    { key: 'h', text: 'Herr', value: 'herr' },
    { key: 'f', text: 'Frau', value: 'frau' },
    { key: 'd', text: 'Dr.', value: 'doktor' },
    { key: 'pd', text: 'Prof.', value: 'professor' },
    { key: 'p', text: 'Prof. Dr.', value: 'professor_doktor' }
]

export const SELECTED_MOVIE_IDS_FOR_SLIDER = [ 
    "6043bb2a2f3a0f4d64616c1d",
    "6043bb2a2f3a0f4d64616be8", 
    "6043bb2a2f3a0f4d64616bf4",  
    "6043bb2a2f3a0f4d64616c30",
    "6043bb2a2f3a0f4d64616be9", 
    "6043bb2a2f3a0f4d64616c20",
    "6043bb2a2f3a0f4d64616c0d",
    "6043bb2a2f3a0f4d64616bf4", 
    "6043bb2a2f3a0f4d64616c1f",
    "6043bb2a2f3a0f4d64616bf0",
    "6043bb2a2f3a0f4d64616c02"
];

export const SELECTED_MOST_POPULAR_MOVIES = [0, 3, 6]

export const ROOM_DATA = [
    {
        'roomId': 'room1',
        "name": "Saal 1"
    },
    {
        'roomId': 'room2',
        "name": "Saal 2"
    }
];

export function arrayToString (inputArray) {
    try {
        if (inputArray){
        
            let string = " ";
            inputArray.map((item, index) => {
                if(index === 0){
                    string = inputArray[index]
                } else {
                    string = string + ", " + inputArray[index]
                }
            })            
            return string;
        } else {
            return "No data"
        }

    } catch {
    }
}

export function getRoomNameById (roomId) {
    try {
        const room = ROOM_DATA.find(item => item.roomId === roomId);
        return room.name
    } catch {

    }
}

export const HOURS = [
    '15:00', '15:15', '15:30', '15:45','16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45',
    '23:00', '23:15', '23:30', '23:45', '24:00', '24:15', '24:30', '24:45', '00:00'
]

//all color options for seat picker
export const colors = {
    'Parkett': 'purple',
    'Loge': 'blue',
    'Premium': 'orange',
    'Loveseat': 'red',
    'Barrierefrei': 'black'
};

//all icon options for seat picker
export const icons = {
    'Parkett': 'user',
    'Loge': 'eye',
    'Premium': 'plus',
    'Loveseat': 'heart',
    'Barrierefrei': 'wheelchair'
};