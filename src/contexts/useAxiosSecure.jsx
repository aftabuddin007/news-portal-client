import axios from 'axios';
import  { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
// import useAuth from '../../hooks/useAuth';



const axiosSecure = axios.create({
    // baseURL:"https://news-portal-server-six-psi.vercel.app"
    baseURL:"http://localhost:3000"

})

const useAxiosSecure = () => {
const {user}=useAuth()
// console.log(user)
useEffect(()=>{
  const reqInterceptor = axiosSecure.interceptors.request.use((config)=>{
    config.headers.Authorization = `Bearer ${user?.accessToken}`
    return config
  })
  const resInterceptor = axiosSecure.interceptors.response.use((response)=>{

      return response
  },(error)=>{
    console.log(error)
    return Promise.reject(error)
  
  })
    
return ()=>{
    axiosSecure.interceptors.request.eject(reqInterceptor)
    axiosSecure.interceptors.response.eject(resInterceptor)
}
},[user])

    return axiosSecure;
};

export default useAxiosSecure;