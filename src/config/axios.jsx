import axios from "axios";
const clienteAxios = axios.create({
    baseURL:`${import.meta.env.VITE_BACKEND_URL}/api`|| "http://localhost:4000/api"
})

export default clienteAxios