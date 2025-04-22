// types/schedule.ts
export type WorkMode = 'WAO' | 'WFH' | 'OFF'
export const DefaultWorkMode = 'WAO'

export interface ScheduleByDate {
    [date: string] : {
        am?: WorkMode;
        pm?: WorkMode;
    }
}