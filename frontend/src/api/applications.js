import { API } from "./axiosInstance";

export const applyToJob=async(JobId)=>{

    const response=await API.post('/applications',{jobId:JobId});
    return  response.data;
}

export const  getMyApplication=async()=>{
     
    const response=await API.get('/applications/mine');
    return response.data;
}