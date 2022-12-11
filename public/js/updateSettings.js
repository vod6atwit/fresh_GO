/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

// type is either password or data(name,email)
export const updateSettings = async (data, type) => {
  // console.log(name, email);
  try {
    const url =
      type === 'password'
        ? // ? 'http://127.0.0.1:8000/api/v1/users/updateMyPassword'
          // : 'http://127.0.0.1:8000/api/v1/users/updateMe';
          'api/v1/users/updateMyPassword'
        : 'api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
