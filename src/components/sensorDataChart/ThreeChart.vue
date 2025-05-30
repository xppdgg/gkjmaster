<script setup lang='ts'>
import axios from 'axios';
import * as echarts from 'echarts';
import 'echarts-gl'
// import 'echarts-gl';
import { Ref, ref, onMounted, onBeforeMount } from 'vue'
interface chartProps  {
    datastring:string
}
const {datastring} = defineProps<chartProps>()
const echartsDom:Ref<HTMLElement|any> = ref(null)
const data = ref<number[][]>()

const copeData = ()=>{
    var data1 = datastring
    var tuples = data1.split("),(");

    // 处理每个元组并将其转换为数组
    var arrays = tuples.map(function(tuple) {
        // 移除括号并根据逗号划分数组
        var values = tuple.replace(/[\(\)]/g, "").split(",");
        // 将字符串数组转换为数字数组并返回
        return values.map(Number);
    });
    data.value=arrays
}

const init = ()=>{
    //创建echarts初始化对象
    const myEcharts = echarts.init(echartsDom.value);

    let option = {
        tooltip: {},
        backgroundColor: '#fff',
        visualMap: {
            show: false,
            dimension: 2,
            min: 0,
            max: 30,
            inRange: {
            color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
            ]
            }
        },
        xAxis3D: {
            type: 'value'
        },
        yAxis3D: {
            type: 'value'
        },
        zAxis3D: {
            type: 'value'
        },
        grid3D: {
            viewControl: {
            projection: 'orthographic'
            },
            top:"0px",
            left:"0px",
            right:"0px",
            bottom:"0px"
        },
        series: [
            {
            type: 'line3D',
            data: data.value,
            lineStyle: {
                width: 4
            }
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