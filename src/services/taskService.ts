import http from './httpService';
import { API_ENDPOINTS } from "../config/apiConfig";
import { TaskData } from "../interfaces";

export const createTask = async (task: TaskData) => {
    const response = await http.post(`${API_ENDPOINTS.task}`, (task));
    return response.data;
}

export const getTasks = async () => {
    const response = await http.get(`${API_ENDPOINTS.task}`);
    return response.data;
}

export const getTasksByJob = async (jobId: string) => {
    const response = await http.get(`${API_ENDPOINTS.task}/job/${jobId}`);
    return response.data;
}

export const updateTask = async (taskId: number, task: TaskData) => {
    const response = await http.patch(`${API_ENDPOINTS.task}/${taskId}`, (task));
    return response.data;
}

export const deleteTask = async (taskId: number) => {
    const response = await http.delete(`${API_ENDPOINTS.task}/${taskId}`);
    return response.data;
}

export const addUpdate = async (taskId: number, update: string) => {
    const response = await http.patch(`${API_ENDPOINTS.task}/update/${taskId}`, { update });
    return response.data;
}