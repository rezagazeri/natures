import {
    showAlert
} from './alerts.js';
import axios from 'axios';

export const updateData = async (data, type) => {

    try {
        const url =
            type === 'password' ?
            'http://127.0.0.1:3000/api/v1/users/updatePasswort' :
            'http://127.0.0.1:3000/api/v1/users/updateme';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        if (res.data.status === 'success') showAlert('success', 'data updated sucsessfully');
    } catch (err) {
        showAlert('error', err.response.data.message);
    }

}