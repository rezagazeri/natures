/* eslint-disable */
import axios from 'axios';

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
        console.log(res);

    } catch (err) {
        console.log(err.response.data)
    }
};