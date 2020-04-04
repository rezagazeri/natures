/* eslint-disable */
import '@babel/polyfill';

import {
    mapbox
} from './mapbox';
import {
    login,
    logout
} from './login';

const loginForm = document.querySelector('.form--login');
const mapBox = document.getElementById('map');
const logoutUser = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    mapbox(locations);
}
//================================================
if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('email').value;
        const passwort = document.getElementById('password').value;
        login(name, passwort);
    });
//==================================================
if (logoutUser) {
    logoutUser.addEventListener('click', logout);
}
//==================================================
if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings({
            name,
            email
        }, 'data');
    })
}
//==================================================
if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const currentpasswort = document.getElementById('password-current').value;
        const passwort = document.getElementById('password').value;
        const confirmpasswort = document.getElementById('password-confirm').value;
        await updateSettings({
            currentpasswort,
            passwort,
            confirmpasswort
        });

        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';

    })