<template>
    <div class="workspace w-full mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center py-4">
            <!-- My Schedule -->
            <div class="flex items-center gap-2">
                <h2 class="text-xl font-semibold text-gray-900">My Schedule</h2>
                <button class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md">
                    <ChevronUp />
                </button>
            </div>

            <!-- Week/Month switcher -->
            <div class="flex bg-white rounded-xl shadow-sm overflow-hidden text-sm font-medium">
                <button
                    :class="[
                    currentView === 'week'
                        ? 'bg-orange-50 text-black border-b-2 border-orange-300'
                        : 'text-gray-600',
                    'px-4 py-1'
                    ]"
                    @click="currentView = 'week'"
                >
                    Week
                </button>
                <button
                    :class="[
                    currentView === 'month'
                        ? 'bg-orange-50 text-black border-b-2 border-orange-300'
                        : 'text-gray-600',
                    'px-4 py-1'
                    ]"
                    @click="currentView = 'month'"
                >
                    Month
                </button>
            </div>
        </div>
      
        <div class="w-full bg-indigo-50 rounded-2xl p-6">
            <!-- Toolbar -->
            <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div class="flex items-center space-x-4">
                    <!-- Today button -->
                    <button
                        class="bg-white text-black px-4 py-1.5 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-100"
                        @click="goToToday"
                    >
                        Today
                    </button>
                    <div class="flex items-center space-x-2">
                        <!-- Left Arrow -->
                        <button
                            class="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 shadow-sm"
                            @click="goToPreviousWeek"
                        >
                            <ChevronLeft />
                        </button>
                        <!-- Right Arrow -->
                        <button
                            class="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 shadow-sm"
                            @click="goToNextWeek"
                        >
                            <ChevronRight />
                        </button>
                    </div>

                    <!-- Date Range -->
                    <div class="text-base font-medium text-gray-900">
                    {{ formattedDateRange }}
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <button 
                        class="bg-indigo-400 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-gray-100"
                    >
                        Notify manager
                    </button>
                    <button 
                        class="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-gray-100"
                        @click="changeScheduleMode"
                    >
                        {{ swicherScheduleLabel }}
                    </button>
                </div>
            </div>
        
            <!-- Day of week -->
            <div 
                :class="halfDayMode ? 'grid grid-cols-12' : 'grid grid-cols-5'"
            >
                <div v-if="halfDayMode"></div>
                <div 
                    :class="halfDayMode ? 'grid col-span-11' : 'grid col-span-5'"
                >
                    <div class="grid grid-cols-5 gap-5 items-center">
                        <div 
                            class="text-center font-semibold"
                            v-for="day in days" :key="day"
                        >
                            <span
                                :class="isToday(day.date) ? 'text-orange-600' : ''"
                            >
                                {{ day.label }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Schedule cards -->
            <template v-if="halfDayMode">
                <div class="grid grid-rows-2 gap-5 mt-4">
                    <!-- Morning Row -->
                    <div class="grid grid-cols-12">
                        <!-- Sunrise Icon -->
                        <div class="flex justify-start items-center">
                            <div class="bg-white p-2 rounded-full shadow text-yellow-500">
                                <Sun class="w-8 h-8" />
                            </div>
                        </div>
                        <div class="grid col-span-11">
                            <div class="grid grid-cols-5 gap-5 items-center">
                                 <!-- Schedule cards (AM) -->
                                <ScheduleCard v-for="day in days" :key="day.date" :date="day.date" :period="'am'" />
                            </div>
                        </div>
                    </div>

                    <!-- Afternoon Row -->
                    <div class="grid grid-cols-12">
                        <!-- Sunrise Icon -->
                        <div class="flex justify-start items-center">
                            <div class="bg-white p-2 rounded-full shadow text-sky-500">
                                <Sunset class="w-8 h-8" />
                            </div>
                        </div>
                        <div class="grid col-span-11">
                            <div class="grid grid-cols-5 gap-5 items-center">
                                 <!-- Schedule cards (PM) -->
                                 <ScheduleCard v-for="day in days" :key="day.date" :date="day.date" :period="'pm'" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <!-- Schedule cards for full day mode -->
            <template v-else>
                <div class="grid grid-rows-1 gap-5 mt-4">
                    <div class="grid grid-cols-5 gap-5 items-center">
                        <!-- Schedule cards (fullday) -->
                        <ScheduleCard v-for="day in days" :key="day.date" :date="day.date" :period="'fullday'" />
                    </div>
                </div>
            </template>

            <div class=" flex items-center justify-between mt-6">
                <!-- Repeat Button -->
                <button @click="modalOpen = true" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm text-sm font-semibold text-gray-800 hover:bg-gray-100">
                    <Repeat1 />
                    Repeat the schedule
                </button>

                <!-- Reset&Confirm schedule Buttons -->
                <div class="flex items-center gap-4">
                    <button @click="showConfirmReset = true" class="text-sm font-semibold text-gray-800 hover:underline">
                        Reset
                    </button>
                    
                    <button
                        @click="confirmSchedule"
                        :disabled="isUpdating || !scheduleStore.hasChanged()"
                        :class="[
                            'text-sm font-semibold text-white px-4 py-2 rounded-full  border-orange-700 shadow-lg hover:opacity-90 transition ',
                            !scheduleStore.hasChanged() 
                            ? 'bg-gray-500'
                            : 'bg-orange-500 border-b-4'
                        ]"
                    >
                        {{ isUpdating ? 'Saving...' : 'Confirm schedule' }}
                    </button>
                </div>
            </div>
        </div>

        <RepeatScheduleModal v-model="modalOpen" />
        <ConfirmResetModal v-model="showConfirmReset" />
    </div>
    
</template>
  
<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import { ChevronUp, ChevronLeft, ChevronRight, Repeat1, Sun, Sunset } from 'lucide-vue-next'
    import dayjs from 'dayjs'
    import ScheduleCard from './ScheduleCard.vue'
    import RepeatScheduleModal from './RepeatScheduleModal.vue'
    import ConfirmResetModal from './ConfirmResetModal.vue'
    import { useScheduleStore } from '../stores/scheduleStore'
    import { useScheduleQuery } from '../composables/scheduleQuery'
    // 
    const scheduleStore = useScheduleStore()
    const { useFetchSchedules, useUpdateSchedule } = useScheduleQuery()

    const { data: schedules, isLoading, isError } = useFetchSchedules()
    // Watch for changes in fetched schedules and update the store
    watch(schedules, (fetchedSchedules) => {
        if (fetchedSchedules) {
           scheduleStore.scheduleByDate = fetchedSchedules
           scheduleStore.originalScheduleByDate = { ...scheduleStore.scheduleByDate }
        }
    })

    const currentView = ref('week')
    const currentWeekStart = ref(dayjs().startOf('week').add(1, 'day')) // start on Monday

    const swicherScheduleLabel = ref('Schedule as half day')
    const halfDayMode = ref(false)
    const modalOpen = ref(false)

    const formattedDateRange = computed(() => {
        const start = currentWeekStart.value
        const end = start.add(4, 'day') // Monday to Friday
        return `${start.format('MMM D')} - ${end.format('D, YYYY')}`
    })
    
    const days = ref([])

    const getCurrentWeekDays = () => {
        const start = currentWeekStart.value
        const weekDays = []
        days.value = Array.from({ length: 5 }, (_, i) => {
            const date = start.add(i, 'day')
            weekDays.push(date.format('YYYY-MM-DD'))
            return {
                label: date.format('ddd D'),
                date: date.format('YYYY-MM-DD')
            }
        })
        scheduleStore.setCurrentWeekDays(weekDays)
    }

    getCurrentWeekDays()
    
    const formatDate = (isoDate) => {
        const date = new Date(isoDate)
        return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })
    }
    
    const isToday = (isoDate) => {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
        return today === isoDate
    }

    const changeScheduleMode = () => {
        halfDayMode.value = !halfDayMode.value
        swicherScheduleLabel.value = halfDayMode.value ? 'Schedule as full day' : 'Schedule as half day'
    }

    const goToToday = () => {
        currentWeekStart.value = dayjs().startOf('week').add(1, 'day')
    }

    const goToPreviousWeek = () => {
        currentWeekStart.value = currentWeekStart.value.subtract(7, 'day')
    }

    const goToNextWeek = () => {
        currentWeekStart.value = currentWeekStart.value.add(7, 'day')
    }

    watch(currentWeekStart, (newWeek) =>{
        getCurrentWeekDays()
    })

    const { mutate: updateSchedule, isLoading: isUpdating } = useUpdateSchedule()

    const showConfirmReset = ref(false)
    
    const reset = () => {
        scheduleStore.resetSchedule()
        showConfirmReset.value = false
    }

    // Confirm schedule
    const confirmSchedule = () => {
        updateSchedule(scheduleStore.scheduleByDate, {
            onSuccess: () => {
                alert('Schedules updated successfully!')
                scheduleStore.originalScheduleByDate = {...scheduleStore.scheduleByDate }
            },
            onError: (error) => {
                alert('Failed to updated schedules. Please try again.')
                console.error(error)
            },
        })
    }
</script>