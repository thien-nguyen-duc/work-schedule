<template>
    <div class="schedule-card flex flex-col gap-2 bg-white rounded-2xl shadow-sm text-center mx-1">
        <div class="text-sm font-bold mb-2 text-black">{{ selectedMode }}</div>
  
        <div class="relative inline-block w-full h-6 mb-3">
            <template v-if="schedule == 'WAO'">
            <select
                class="w-full text-xs text-gray-700 font-semibold appearance-none px-3 py-1.5 pr-6 bg-white rounded-lg shadow border-none focus:outline-none"
            >
                <option v-for="seat in seatOptions" :key="seat" :value="seat">
                    {{ seat }}
                </option>
            </select>
            
            <ChevronDown class="pointer-events-none absolute inset-y-1 right-2 flex items-center w-4 h-4" />
            </template>
        </div>
        
        <div class="flex justify-between items-center space-x-2">
            <button
                class="w-12 h-12 p-2 rounded-xl flex justify-center items-center cursor-pointer border"
                v-for="type in types"
                :key="type.id"
                :class="schedule === type.id ? type.color : 'text-gray-300'"
                @click="updateMode(type.id)"
            >
                <component :is=type.icon />
            </button>
            
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { Laptop, House, Clock, ChevronDown } from 'lucide-vue-next'
    import { useScheduleStore, DefaultWorkMode } from '../stores/scheduleStore'
    
    const props = defineProps<{date: string, period: 'fullday' | 'am' | 'pm' }>()
    const scheduleStore = useScheduleStore()
    const seatOptions = ['F7 - Seat 01']
    const types = [
        { id: 'WAO', label: 'WAO', icon: Laptop, color: 'bg-blue-500 text-white' },
        { id: 'WFH', label: 'WFH', icon: House, color: 'bg-rose-600 text-white' },
        { id: 'OFF', label: 'OFF', icon: Clock, color: 'bg-gray-600 text-white' }
    ]

    const defaultMode = 'WAO'

    const selectedMode = computed({
        get: () => {
            if (props.period == 'fullday' || props.period == 'am') {
                return (scheduleStore.scheduleByDate[props.date] as any)?.am ?? defaultMode
            }
            else {
                return (scheduleStore.scheduleByDate[props.date] as any)?.pm ?? defaultMode
            }
        },
        set: (mode) => {
            scheduleStore.setSchedule(props.date, mode, props.period)
        }
    })

    // Compute the schedule for the given date and period
    const schedule = computed(() => {
        const daySchedule = scheduleStore.scheduleByDate[props.date]
        
        if (!daySchedule) return DefaultWorkMode

        if (props.period === 'am') return daySchedule.am
        if (props.period === 'pm') return daySchedule.pm
        if (props.period === 'fullday') return `${daySchedule.am}`

        return DefaultWorkMode
    })

    const updateMode = (mode: string) => {
        selectedMode.value = mode
    }
    
</script>

<style scoped>
    .schedule-card {
        min-width: 180px;
        padding: 18px;
        padding-bottom: 10px;
    }
    
</style>