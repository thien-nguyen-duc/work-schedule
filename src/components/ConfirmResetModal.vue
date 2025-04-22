<template>
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
            <!-- Header -->
            <div class="w-full relative border-b-2 border-gray-400 item-center px-6 py-4">
                <h2 class="text-xl font-extrabold text-left">Reset Schedule?</h2>
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
                <div class="text-sm font-semibold text-left mb-2">This will undo all unsaved changes.</div>
            </div>
    
            <!-- Footer -->
            <div class="flex justify-end gap-4 text-sm mt-8 mb-6 px-6">
                <button @click="close" class="text-gray-600 font-medium">No</button>
                <button @click="resetSchedule" class="bg-orange-500 text-white font-semibold px-10 py-2 rounded-full hover:bg-orange-600">Yes</button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, defineEmits } from 'vue'
    import { X } from 'lucide-vue-next';
    import { useScheduleStore } from '../stores/scheduleStore'
    
    const props = defineProps({
        modelValue: Boolean,
    })
    const modelValue = defineModel()
    const emit = defineEmits(['update:modelValue', 'close'])
    
    const scheduleStore = useScheduleStore()

    const selectedOptions = ref([])
    
    function close() {
        emit('update:modelValue', false)
        selectedOptions.value = []
    }
  
    function resetSchedule() {
        scheduleStore.resetSchedule()
        close()
    }
</script>