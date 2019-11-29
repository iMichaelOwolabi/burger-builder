import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-1c732.firebaseio.com/'
});

export default instance;
