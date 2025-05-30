<script setup lang='ts'>
import axios from 'axios';
import * as echarts from 'echarts';
// import 'echarts-gl';
import { Ref, ref, onMounted, onBeforeMount } from 'vue'

interface chartProps  {
    datastring:string
}
const {datastring} = defineProps<chartProps>()
const echartsDom:Ref<HTMLElement|any> = ref(null)
const data = ref<number[]>()
const xdata = ref<number[]>()
const copeData = ()=>{
    const inputString = datastring;
    const regex = /\((\d+),(\d+),(\d+)\)/g;
    const firstNumbers = [];
    const first = []
    let match:RegExpExecArray;
    let i:number = 1;
    while ((match = regex.exec(inputString)) !== null) {
        firstNumbers.push(parseInt(match[1]));
        first.push(i) 
        i++;
    }
    data.value = firstNumbers
    xdata.value = first
    console.log(999,firstNumbers);
    }

const init = ()=>{
    //创建echarts初始化对象
    const myEcharts = echarts.init(echartsDom.value);

    let option = {
        xAxis: {
            type: 'category',
            data: xdata.value
        },
        yAxis: {
            type: 'value',
            min: 'dataMin',
            max: 'dataMax',
            splitArea: {show: false}
        },
        series: [
            {
            data: data.value,
            type: 'line'
            }
        ]
    };
    //校验表结构是否存在,存在就渲染
    option && myEcharts.setOption(option);
}

onBeforeMount(()=>{
    copeData()
    console.log(data.value);
    
})

//4.在组件挂载的生命周期中获取到DOm节点
onMounted(() => {
    init()  
})






</script>
<template>
    <div ref="echartsDom" style="height: 98vh;width: 150vh"></div>
</template>
<style lang='scss' scoped>

</style>