/* eslint-disable */

import axios from 'axios';

import {
    showAlert,
} from './alerts';

export const login = async (name, passwort) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                name,
                passwort
            }
        });
        console.log(res)
        if (res.data.status === 'success') {
            showAlert('success', 'you are logged in successfully !');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }

    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
        if (res.data.status === 'success') location.reload(true);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}