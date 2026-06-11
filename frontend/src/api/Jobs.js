import { API } from "./axiosInstance";

export const getAllJobs=async ()=>{

    const response=await API.get('/jobs');
    return response.data;
    
}
export const getJobById=async (id)=>{
    const response=await API.get(`/jobs/${id}`);
    console.log(response.data);
    return response.data;
}

