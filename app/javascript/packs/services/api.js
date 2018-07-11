import axios from 'axios'

const baseUrl = 'http://localhost:3000/api'

const buildUrl = (path) => {
    return `${baseUrl}${path}`
}

export const get = (path, config = null) => {
    return axios.get(buildUrl(path), config)
}

export const put = (path, data, config = null) => {
    return axios.put(buildUrl(path), data, config)
}
