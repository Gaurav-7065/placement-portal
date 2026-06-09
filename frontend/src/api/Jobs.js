import { API } from "./axiosInstance";

export const getAllJobs=async ()=>{

    const response=await API.get('/jobs');
    return response.data;
    
}
export const getJobById=async ()=>{

    const response=await API.get(`/jobs:/${id}`);
    return response.data;
}

