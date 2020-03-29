/* eslint-disable */
import '@babel/polyfill';

import {
    mapbox
} from './mapbox';
import {
    login
} from './login';

const mapBox = document.getElementById('map');
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    mapbox(locations);
}
const loginForm = document.querySelector('.form--login');
if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('email').value;
        const passwort = document.getElementById('password').value;
        login(name, passwort);
    });