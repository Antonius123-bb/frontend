//service api url
export const API_URL = 'http://localhost:8081';

//name for user localstorage object
export const USER_COOKIE_INFO = 'userinfo';

//name for cart localstorage object
export const CART_COOKIE = 'cart';

//name for cookie settings localstorage object
export const COOKIE_VALUE = 'allowedCookies';

//name for adress localstorage object
export const ALL_ADDRESSES = 'all-addresses';


//all anrede options
export const ANREDE_OPTIONS = [
    { key: 'h', text: 'Herr', value: 'herr' },
    { key: 'f', text: 'Frau', value: 'frau' },
    { key: 'd', text: 'Dr.', value: 'doktor' },
    { key: 'pd', text: 'Prof.', value: 'professor' },
    { key: 'p', text: 'Prof. Dr.', value: 'professor_doktor' }
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