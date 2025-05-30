<template>
  <div>
    <!-- 搜索框 -->
    <div style="background-color: #007b52; height: 40px; display: flex; justify-content: flex-end; padding: 0 30px;">
      <a-input-search 
        style="width: 300px; margin-top: 3px;" 
        placeholder="请输入ID搜索" 
        enter-button 
        @search="handleSearch"
      />
    </div>

    <a-modal 
      v-model:visible="chartVisible" 
      title="时间间隔分析图" 
      width="800px"
      @cancel="handleChartClose"
    >
      <div ref="chartRef" style="width: 100%; height: 400px;"></div>
    </a-modal>

    <div v-if="loading" class="loading">数据加载中...</div>
    <div v-else-if="error" class="error">数据加载失败</div>
    <template v-else>
      <div v-if="equipmentList.length === 0" class="empty">暂无数据</div>
      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>数据记录</th>
            <th>创建时间</th>
            <th>传感器ID</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in equipmentList" :key="item.id">
            <tr v-if="item" class="data-row">
              <td @click="showChart(item)" style="cursor: pointer; color: #1890ff;">
                {{ item.id ?? 'N/A' }}
              </td>
              <td>
                <div v-for="(record, index) in parseData(item.data)" :key="index">
                  {{ formatDataTime(record) }}
                </div>
              </td>
              <td>{{ formatDate(item.utc_create) }}</td>
              <td>{{ item.clwksensor_id || 'N/A' }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import moment from 'moment';
import { Modal } from 'ant-design-vue';
import * as echarts from 'echarts';

interface Equipment {
  id: number;
  data: string;
  utc_create: string;
  clwksensor_id: number;
  [key: string]: any;
}

interface TimeData {
  xData: number[];
  yData: number[];
}

const API_BASE = 'http://1.94.37.31/hailiangweb-2.0/companys/1/roles/1/login_users/1/windows/1/docs/1/action_docs/5/datas/cldatasensor';

export default defineComponent({
  setup() {
    const equipmentList = ref<Equipment[]>([]);
    const loading = ref(true);
    const error = ref(false);
    const chartVisible = ref(false);
    const chartRef = ref<HTMLElement>();
    let chartInstance: echarts.ECharts | null = null;
    const currentChartData = ref<TimeData>({ xData: [], yData: [] });
    let resizeTimer: number;
    const keywords = ref<string>('');

    // 数据获取方法
    const fetchData = async () => {
      try {
        loading.value = true;
        const params = {
          offset: 0,
          limit: 50,
          type: 'sig',
          orderby: 'id desc',
          ...(keywords.value && { filter: `id:eq:${keywords.value}` })
        };

        const response = await axios.get(API_BASE, { params });
        
        if (response.data?.data_response?.cldatasensor) {
          equipmentList.value = response.data.data_response.cldatasensor
            .filter((item: any) => item !== null)
            .map((item: any) => ({
              id: item.id,
              data: item.data,
              utc_create: item.utc_create,
              clwksensor_id: item.clwksensor_id
            }));
        }
      } catch (e: any) {
        console.error('请求错误:', e);
        error.value = true;
        Modal.error({ title: '请求失败', content: '数据加载失败，请稍后重试' });
      } finally {
        loading.value = false;
      }
    };

    // 搜索处理
    const handleSearch = (words: string) => {
      if (words && !/^\d+$/.test(words)) {
        Modal.error({ title: '输入错误', content: '请输入有效的数字ID' });
        return;
      }
      keywords.value = words;
      fetchData();
    };

    const parseData = (dataString: string): string[] => {
      try {
        return dataString
          .replace(/[\[\]]/g, '')
          .split(' ,')
          .map(item => item.trim());
      } catch {
        return [];
      }
    };

    const formatDataTime = (timeString: string): string => {
      return moment(timeString, 'YYYY-MM-DD HH:mm:ss').isValid() 
        ? moment(timeString).format('YYYY-MM-DD HH:mm:ss')
        : '无效时间';
    };

    const formatDate = (dateString: string): string => {
      return moment(dateString).isValid() 
        ? moment(dateString).format('YYYY-MM-DD HH:mm:ss')
        : 'N/A';
    };

    const calculateTimeDiffs = (timeStrings: string[]): TimeData => {
      const diffs: number[] = [];
      const xData: number[] = [];
      
      for (let i = 1; i < timeStrings.length; i++) {
        const prev = moment(timeStrings[i-1], 'YYYY-MM-DD HH:mm:ss');
        const current = moment(timeStrings[i], 'YYYY-MM-DD HH:mm:ss');
        
        if (prev.isValid() && current.isValid()) {
          diffs.push(current.diff(prev, 'seconds')<0?0:current.diff(prev, 'seconds'));
          xData.push(i);
        }
      }
      return { xData, yData: diffs };
    };

    const showChart = (item: Equipment) => {
      const timeList = parseData(item.data);
      if (timeList.length < 2) {
        Modal.error({ title: '数据不足', content: '至少需要两个时间点才能生成图表' });
        return;
      }
      
      currentChartData.value = calculateTimeDiffs(timeList);
      chartVisible.value = true;
      setTimeout(initChart, 50);
    };

    const initChart = () => {
      if (!chartRef.value) return;
      chartInstance = echarts.init(chartRef.value);
      const option = {
        title: { text: '时间间隔分析', left: 'center' },
        tooltip: {
          trigger: 'item',
          formatter: ({ data }: { data: number }) => `间隔时长：${data}秒`
        },
        xAxis: {
          type: 'category',
          name: '事件序号',
          data: currentChartData.value.xData
        },
        yAxis: { type: 'value', name: '时间间隔（秒）' },
        series: [{
          data: currentChartData.value.yData,
          type: 'line',
          smooth: true,
          lineStyle: { color: '#3b8f73', width: 2 },
          itemStyle: { color: '#3b8f73' }
        }]
      };
      chartInstance.setOption(option);
    };

    const handleChartClose = () => {
      chartInstance?.dispose();
      chartInstance = null;
    };

    const handleResize = () => {
      if (chartInstance) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => chartInstance?.resize(), 200);
      }
    };

    onMounted(async () => {
      window.addEventListener('resize', handleResize);
      await fetchData();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      handleChartClose();
    });

    return {
      equipmentList,
      loading,
      error,
      chartRef,
      chartVisible,
      parseData,
      formatDataTime,
      formatDate,
      showChart,
      handleChartClose,
      handleSearch
    };
  }
});
</script>

<style scoped>
/* 原有样式保持不变 */
.loading, .error {
  padding: 20px;
  text-align: center;
  font-size: 16px;
}

.error {
  color: #ff4444;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f5f7fa;
  font-weight: 600;
}

.data-row:hover {
  background-color: #f8f9fa;
}

.empty {
  padding: 20px;
  text-align: center;
  color: #666;
}

.data-row td div {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}
.data-row td div:last-child {
  border-bottom: none;
}

td[style*="cursor: pointer"]:hover {
  text-decoration: underline;
  opacity: 0.8;
}

.ant-input-search-button {
  background-color: #3b8f73;
  border-color: #3b8f73;
}

.ant-input-search-button:hover {
  background-color: #2d6b56 !important;
  border-color: #2d6b56 !important;
}
</style>
