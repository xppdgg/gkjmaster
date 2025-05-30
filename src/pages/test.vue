<script setup lang='ts'>
import axios from 'axios';
import { addSql, doSql, login } from '../api/axios/axios';
import { cluserRedata } from './log/cluserrecord';
import * as echarts from 'echarts';
import 'echarts-gl'
// import 'echarts-gl';
import { Ref, ref, onMounted, onBeforeMount } from 'vue'
import Player from 'xgplayer';



let player = ref<Player>()
const initPlayer = () => {
        player.value = new Player({
            id: 'mss',
            url: 'http://1.94.37.31:8888/group1/M00/00/12/wKgAy2X6cJyATFVNACgALDhNb08863.mp4',
            // plugins: [FlvJsPlugin],
            // playsinline: false,
            // autoplay: false,
            // fluid: true,
            // isLive: true,
            // screenShot: true,
            // whitelist: [""],
            // ignores: ["time"],
            // closeVideoClick: true,
            // customConfig: {
            // isClickPlayBack: false,
            // },
        });
};

onMounted(()=>{
    initPlayer()
})




</script>
<template>
    <!-- <div ref="echartsDom" style="height: 100vh;width: 150vh"></div> -->
    <div :id="'mss'"></div>
</template>
<style lang='scss' scoped>

</style>