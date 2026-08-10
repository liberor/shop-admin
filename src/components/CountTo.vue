<template>
    {{ d.num.toFixed(2) }}
</template>

<script lang="ts" setup>
import { ref,watch } from 'vue';
import gsap from 'gsap';
const props = defineProps({
    value:{
        type:Number,
        required : true
    }
})
const d = ref({
    num:0
})
function animateToValue(){
    gsap.to(d.value,{
        num:props.value,
        duration : 0.5
    })
}
animateToValue()
watch(()=>props.value,()=>{
    animateToValue()
})

</script>

<style scoped>

</style>