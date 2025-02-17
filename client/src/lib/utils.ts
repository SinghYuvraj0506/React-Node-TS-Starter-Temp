import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const axiosServices = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials:true });