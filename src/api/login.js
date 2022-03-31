import axios from 'axios'
const http = axios.create({
    baseURL: 'http://server.mygood.top/api/'
})
export default http
