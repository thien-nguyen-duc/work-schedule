<template>
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
            <!-- Header -->
            <div class="w-full relative border-b-2 border-gray-400 item-center px-6 py-4">
                <h2 class="text-xl font-extrabold text-left">Repeat the schedule</h2>
                <!-- Close Button -->    
                    <button
                        class="absolute top-4 right-6 w-6 h-6 rounded-full flex justify-center items-center bg-gray-500 text-white outline-1 outline-offset-3 outline-white hover:outline-orange-400"
                        @click="close"
                    >
                        <X class="w-3 h-3" />
                    </button>
                
            </div>
            
            <!-- Repeat Option -->
            <div class="w-full relative mt-4 px-6">
                <div class="text-sm font-extrabold text-left mb-2">Repeat option:</div>
                <div class="flex items-center gap-2 text-md font-medium">
                    <span class="w-2 h-2 ml-1 rounded-full bg-orange-500 inline-block outline-1 outline-offset-3 outline-orange-500"></span>
                    <span >Repeat for</span>
                    <div class="relative inline-block">
                        <select 
                            v-model="repeatWeeks" 
                            class="w-20 appearance-none px-3 py-1.5 pr-6 bg-white rounded-lg shadow border-none focus:outline-none"
                        >
                            <option v-for="n in 7" :key="n" :value="n">{{ n }}</option>
                        </select>
                        <ChevronsUpDown class="w-4 h-4 absolute inset-y-2.5 right-2"/>
                    </div>
                    <span>week</span>
                    <span>(max 7)</span>
                </div>
            </div>
    
            <!-- Repeat For -->
            <div class="w-full relative mt-4 px-6">
                <div class="text-sm font-extrabold text-left mb-2">Repeat for:</div>
                <div class="grid grid-cols-2 gap-6">
                    <div v-for="option in repeatOptions"
                        class="w-full border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-orange-500"
                        @click="toggleOptions(option.id)">
                        <div class="text-left transform scale-125 px-4">
                            <input class="accent-orange-500" type="checkbox" :checked="isSelected(option.id)" @change.stop />
                        </div>
                        <div class="w-full text-center mt-4 text-gray-400">
                            <div class="flex justify-center items-center"><component :is="option.icon" class="w-10 h-10"/></div>
                            <p class="text-md font-medium"><span>{{ option.label }}</span></p>
                        </div>
                    </div>
                    
                </div>
            </div>
    
            <!-- Footer -->
            <div class="flex justify-end gap-4 text-sm mt-8 mb-6 px-6">
                <button @click="close" class="text-gray-600 font-medium">Cancel</button>
                <button @click="save" class="bg-orange-500 text-white font-semibold px-10 py-2 rounded-full hover:bg-orange-600">Save</button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, watch, defineEmits } from 'vue'
    import { ChevronsUpDown, X, Laptop, House } from 'lucide-vue-next';
    import { useScheduleStore } from '../stores/scheduleStore'
    
    const props = defineProps({
        modelValue: Boolean,
    })
    const modelValue = defineModel()
    const emit = defineEmits(['update:modelValue', 'close'])
    
    const scheduleStore = useScheduleStore()

    const repeatWeeks = ref(1)
    
    const repeatOptions = [
        { id: 'WAO', label: 'Work at office', icon: Laptop},
        { id: 'WFH', label: 'Work from home', icon: House}
    ]

    const selectedOptions = ref([])
    
    function close() {
        emit('update:modelValue', false)
        selectedOptions.value = []
    }
  
    function save() {
        scheduleStore.repeatWeekSchedule(repeatWeeks.value, selectedOptions.value)
        close()
    }
  
    function isSelected(type) {
        return selectedOptions.value.includes(type)
    }

    function toggleOptions(id) {
        const index = selectedOptions.value.indexOf(id)
        if (index > -1) {
            selectedOptions.value.splice(index, 1) // uncheck
        } else {
            selectedOptions.value.push(id) // check
        }
    }
</script>