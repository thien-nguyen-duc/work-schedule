import { useQuery, useMutation } from '@tanstack/vue-query'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL
const userId = '123' // Hard code user ID

export function useScheduleQuery() {
    const fetchSchedules = async () => {
        const response = await axios.get(`${API}?userId=${userId}`)
        return response.data
    }

    const useFetchSchedules = () => {
        return useQuery({ 
            queryKey: ['schedule'], 
            queryFn: fetchSchedules
        })
    }

    const useUpdateSchedule = () => {
        return useMutation({
            mutationFn: (schedules: any) => axios.put(`${API}?userId=${userId}`, schedules),
            onSuccess: () => {
                console.log('Schedule updated successfully')
            },
            onError: (error) => {
                console.error('Failed to update schedule:', error)
            },
        })
    }

    return {
        useFetchSchedules,
        useUpdateSchedule
    }
}