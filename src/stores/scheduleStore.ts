import { defineStore } from 'pinia'
import type { ScheduleByDate, WorkMode } from '../types/ScheduleByDate'

export const DefaultWorkMode = 'WAO'
export const useScheduleStore = defineStore('schedule', {
    state: () => ({
        currentWeekDays: [] as string[],
        scheduleByDate: {} as ScheduleByDate,
        originalScheduleByDate: {} as ScheduleByDate,
    }),

    actions: {
        setCurrentWeekDays(days: any) {
            this.currentWeekDays = days
        },

        setSchedule(date: string, mode:WorkMode, period: 'fullday' | 'am' | 'pm') {
            console.log('setSchedule:')
            console.log('date:', date)
            console.log('mode:', mode)
            console.log('period:', period)
            const current = this.scheduleByDate[date] as any
            const newSchedule = { ...this.scheduleByDate }
            if (period == 'fullday') {
                newSchedule[date] = {
                    am: mode,
                    pm: current?.pm ?? DefaultWorkMode
                }
            } else {
                newSchedule[date] = {
                    am: period === 'am' ? mode : current?.am ?? DefaultWorkMode,
                    pm: period === 'pm' ? mode : current?.pm ?? DefaultWorkMode
                }
            }
            this.scheduleByDate = newSchedule
        },

        resetSchedule() {
            this.scheduleByDate = { ...this.originalScheduleByDate }
        },

        repeatWeekSchedule(repeateCount:number, options:string[]) {
            const newSchedule = { ...this.scheduleByDate }
            this.currentWeekDays.forEach((baseDate) =>{
                const baseDay = new Date(baseDate).getDay()
                // Skip weekends
                if (baseDay === 0 || baseDay === 6) return
                
                const baseSchedule = this.scheduleByDate[baseDate]

                // repeat this schedule for the next weeks
                for (let i = 1; i <= repeateCount; i++) {
                    // Create a new day by adding (i * 7) days to baseDate
                    const repeatDate = new Date(baseDate)
                    repeatDate.setDate(repeatDate.getDate() + i * 7)
                    // Format the date to YYYY-MM-DD
                    const isoDate = repeatDate.toISOString().split('T')[0]
                    // Save to the store
                    if (options.length > 0) {
                        // Clone work mode inluded in options
                        newSchedule[isoDate] = {
                            am: options.includes(baseSchedule?.am ?? '') ? baseSchedule.am : DefaultWorkMode,
                            pm: options.includes(baseSchedule?.pm ?? '') ? baseSchedule.pm : DefaultWorkMode
                        }
                    } else {
                        newSchedule[isoDate] = baseSchedule
                    }
                }
            })
            this.scheduleByDate = newSchedule
        },

        // Track if there are changes to the schedule
        hasChanged(): boolean {
            return JSON.stringify(this.scheduleByDate) !== JSON.stringify(this.originalScheduleByDate)
        }
    }
})