<template>
    {{ d.num.toFixed(tofixed ?? 0) }}
</template>

<script lang="ts" setup>
import { ref,watch } from 'vue';
import gsap from 'gsap';
gsap.ticker.fps(52)
const props = defineProps({
    value:{
        type:Number,
        required : true
    },
    tofixed:{
        type:Number,
        required : false
    }
})
const d = ref({
    num:0
})
function animateToValue(){
    gsap.to(d.value,{
        num:props.value,
        duration : 0.5,
    })
}
animateToValue()
watch(()=>props.value,()=>{
    animateToValue()
})

</script>

<style scoped>

</style>