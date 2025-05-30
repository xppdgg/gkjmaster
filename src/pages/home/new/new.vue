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

    <!-- 比较功能 -->
    <div style="margin: 20px; display: flex; gap: 10px; align-items: center;">
      <a-input 
        v-model:value="compareId1" 
        placeholder="请输入第一个ID" 
        style="width: 200px;" 
      />
      <a-input 
        v-model:value="compareId2" 
        placeholder="请输入第二个ID" 
        style="width: 200px;" 
      />
      <a-button 
        type="primary" 
        @click="handleCompare"
        :disabled="!compareId1 || !compareId2"
      >
        比较
      </a-button>
    </div>

    <a-modal 
      v-model:open="chartVisible" 
      title="时间间隔分析图" 
      width="80%"
      :footer="null"
      @cancel="handleChartClose"
    >
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div style="display: flex; gap: 10px;">
          <a-input 
            v-model:value="newCompareId" 
            placeholder="输入要添加的ID" 
            style="width: 200px;" 
          />
          <a-button 
            type="primary" 
            @click="addToChart"
            :disabled="!newCompareId"
          >
            添加
          </a-button>
        </div>
      </div>
      <div ref="chartRef" style="width: 100%; height: 400px;"></div>
      <div v-if="compareChartData.length > 0" style="margin-top: 20px;">
        <a-list
          :data-source="compareChartData"
          :grid="{ gutter: 16, column: 4 }"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card :style="{ borderLeft: `4px solid ${item.color}` }">
                <template #actions>
                  <a-button type="link" danger @click="removeFromChart(item.id)">
                    移除
                  </a-button>
                </template>
                <a-card-meta :title="`ID: ${item.id}`" />
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-modal>

    <div v-if="loading" class="loading">数据加载中...</div>
    <div v-else-if="error" class="error">数据加载失败</div>
    <template v-else>
      <div v-if="dataList.length === 0" class="empty">暂无数据</div>
      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>数据</th>
            <th>修改时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in dataList" :key="item.id">
            <tr v-if="item" class="data-row">
              <td @click="showChart(item)" style="cursor: pointer; color: #1890ff;">
                {{ item.id ?? 'N/A' }}
              </td>
              <td style="max-width: 400px; overflow: auto;">
                {{ formatData(item.data) }}
              </td>
              <td>{{ formatDate(item.utc_create) }}</td>
              <td :style="{ color: item.state === 'NG' ? 'red' : 'green' }">
                {{ item.state || 'N/A' }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
    <a-pagination 
      v-model:current="currentPage"
      :total="total"
      :page-size="pageSize"
      show-less-items
      :show-total="total => `共 ${total} 条`"
      style="margin: 20px; text-align: center;"
      @change="handlePageChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';
import moment from 'moment';
import { Modal } from 'ant-design-vue';
import * as echarts from 'echarts';

interface NewData {
  id: number;
  data: string;
  utc_create: string;
  state: string;
  [key: string]: any;
}

interface TimeData {
  xData: number[];
  yData: number[];
}

interface ChartData {
  id: number;
  data: TimeData;
  color: string;
}

const API_BASE = 'http://1.94.37.31/hailiangweb-2.0/companys/1/roles/1/login_users/1/windows/1/docs/1/action_docs/1008/datas/cldatasensor';

export default defineComponent({
  setup() {
    const dataList = ref<NewData[]>([]);
    const loading = ref(true);
    const error = ref(false);
    const chartVisible = ref(false);
    const chartRef = ref<HTMLElement>();
    let chartInstance: echarts.ECharts | null = null;
    const currentChartData = ref<TimeData>({ xData: [], yData: [] });
    let resizeTimer: number;
    const keywords = ref<string>('');
    const currentPage = ref(1);
    const compareId1 = ref<string>('');
    const compareId2 = ref<string>('');
    const compareChartData = ref<ChartData[]>([]);
    const total = ref(0);
    const pageSize = ref(100);
    const newCompareId = ref<string>('');
    const colors = ref(['#3b8f73', '#ff7f0e', '#1f77b4', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']);

    const fetchData = async () => {
      try {
        loading.value = true;
        const params = {
          offset: 0,
          limit: pageSize.value,
          type: 'sig',
          orderby: 'id desc',
          ...(keywords.value && { where: `id:eq:'${keywords.value}'` })
        };

        const response = await axios.get(API_BASE, { params });
        
        if (response.data?.data_response?.cldatasensor) {
          total.value = response.data.data_response.total || 2000;
          dataList.value = response.data.data_response.cldatasensor
            .filter((item: any) => item !== null)
            .map((item: any) => ({
              id: item.id,
              data: item.data,
              utc_create: item.utc_create,
              state: item.state
            }));
        }
      } catch (e: any) {
        console.error('请求错误:', e);
        error.value = true;
        Modal.error({ title: '请求失败', content: '数据加载失败，请稍后重试', open: true });
      } finally {
        loading.value = false;
      }
    };

    const handlePageChange = (page: number) => {
      currentPage.value = page;
      fetchData();
    };

    const handleSearch = (words: string) => {
      if (words && !/^\d+$/.test(words)) {
        Modal.error({ title: '输入错误', content: '请输入有效的数字ID', open: true });
        return;
      }
      currentPage.value = 1;
      keywords.value = words;
      fetchData();
    };

    const parseData = (dataString: string): number[] => {
      try {
        const raw = dataString
          .replace(/[\[\]]/g, '')
          .split(',')
          .map(Number);
        return raw
          .filter(n => {
            const minValid = 946684800000;   // 2000-01-01
            const maxValid = 4102444800000;  // 2100-01-01
            return !isNaN(n) && 
                   n !== 0 && 
                   n !== 604799990 && 
                   n >= minValid && 
                   n <= maxValid;
          });
      } catch {
        return [];
      }
    };

    const formatDate = (dateString: string): string => {
      return moment(dateString).isValid() 
        ? moment(dateString).format('YYYY-MM-DD HH:mm:ss')
        : 'N/A';
    };

    const formatData = (dataString: string): string => {
      try {
        const arr = dataString.replace(/[\[\]]/g, '').split(',');
        return `[${arr.slice(0, 5).join(', ')}${arr.length > 5 ? '...' : ''}]`;
      } catch {
        return '[]';
      }
    };

    const MAX_INTERVAL = 10000;

    const calculateTimeDiffs = (validData: number[]): TimeData => {
      const diffs: number[] = [];
      const xData: number[] = [];
      
      if (validData.length < 2) return { xData: [], yData: [] };

      let k=1;
      for (let i = 1; i < validData.length; i++) {
        const diff = validData[i] - validData[i-1];
        if (diff > 0 && diff < MAX_INTERVAL) {
          diffs.push(diff);
          xData.push(k);  
          k++;
        }
      }
      return { xData, yData: diffs };
    };

    const showChart = (item: NewData) => {
      const data = parseData(item.data);
      if (data.length < 2) {
        Modal.error({ title: '数据不足', content: '至少需要两个数据点才能生成图表', open: true });
        return;
      }
      
      compareChartData.value = [{
        id: item.id,
        data: calculateTimeDiffs(data),
        color: colors.value[0]
      }];
      chartVisible.value = true;
      nextTick(initChart);
    };

    const handleCompare = async () => {
      if (!compareId1.value || !compareId2.value) {
        Modal.error({ title: '输入错误', content: '请输入两个有效的ID' });
        return;
      }

      const id1 = Number(compareId1.value);
      const id2 = Number(compareId2.value);
      
      if (isNaN(id1) || isNaN(id2) || id1 < 4444 || id2 < 4444) {
        Modal.error({ title: '输入错误', content: '请输入大于等于4444的数字ID', open: true });
        return;
      }

      try {
        loading.value = true;
        const [res1, res2] = await Promise.all([
          axios.get(API_BASE, { params: { 
            offset: 0,
            limit: 1,
            type: 'sig',
            where: `id:eq:'${id1}'`
          } }),
          axios.get(API_BASE, { params: { 
            offset: 0,
            limit: 1,
            type: 'sig',
            where: `id:eq:'${id2}'`
          } })
        ]);

        const data1 = res1.data?.data_response?.cldatasensor?.[0];
        const data2 = res2.data?.data_response?.cldatasensor?.[0];

        if (!data1 || !data2) {
          throw new Error('未找到对应ID的数据');
        }

        const parsed1 = parseData(data1.data);
        const parsed2 = parseData(data2.data);

        if (parsed1.length < 2 || parsed2.length < 2) {
        Modal.error({ title: '数据不足', content: '两个ID都需要至少两个数据点才能比较', open: true });
          return;
        }

        compareChartData.value = [
          { id: data1.id, data: calculateTimeDiffs(parsed1), color: colors.value[0] },
          { id: data2.id, data: calculateTimeDiffs(parsed2), color: colors.value[1] }
        ];

        chartVisible.value = true;
        nextTick(initChart);
      } catch (e) {
        console.error('比较失败:', e);
        Modal.error({ title: '比较失败', content: '获取比较数据失败，请检查ID是否正确' });
      } finally {
        loading.value = false;
      }
    };

    const initChart = () => {
      if (!chartRef.value) return;
      chartInstance = echarts.init(chartRef.value);
      const option = {
        title: { 
          text: compareChartData.value.length > 1 
            ? `ID ${compareChartData.value[0].id} 与 ID ${compareChartData.value[1].id} 比较` 
            : '时间间隔分析', 
          left: 'center' 
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const seriesName = params.seriesName;
            return `${seriesName}<br/>间隔时长：${params.data.toFixed(1)}毫秒`;
          }
        },
        legend: {
          data: compareChartData.value.map(item => `ID ${item.id}`),
          bottom: 10
        },
        xAxis: {
          type: 'category',
          name: '数据序号',
          data: compareChartData.value[0]?.data.xData || []
        },
        yAxis: { 
          type: 'value', 
          name: '时间间隔',
          axisLabel: {
            formatter: (value: number) => (value).toFixed(0) + 'ms'
          }
        },
        series: compareChartData.value.map(item => ({
          name: `ID ${item.id}`,
          data: item.data.yData,
          type: 'line',
          smooth: true,
          lineStyle: { color: item.color, width: 2 },
          itemStyle: { color: item.color }
        }))
      };
      chartInstance.setOption(option);
    };

    const addToChart = async () => {
      const id = Number(newCompareId.value);
      
      if (isNaN(id) || id < 4444) {
        Modal.error({ title: '输入错误', content: '请输入大于等于4444的数字ID', open: true });
        return;
      }

      try {
        loading.value = true;
        const res = await axios.get(API_BASE, { 
          params: { 
            offset: 0,
            limit: 1,
            type: 'sig',
            where: `id:eq:'${id}'`
          } 
        });

        const data = res.data?.data_response?.cldatasensor?.[0];
        if (!data) {
          throw new Error('未找到对应ID的数据');
        }

        const parsed = parseData(data.data);
        if (parsed.length < 2) {
          Modal.error({ title: '数据不足', content: '至少需要两个数据点才能添加到图表' });
          return;
        }

        const newColor = colors.value[compareChartData.value.length % colors.value.length];
        compareChartData.value.push({
          id: data.id,
          data: calculateTimeDiffs(parsed),
          color: newColor
        });

        initChart();
        newCompareId.value = '';
      } catch (e) {
        console.error('添加失败:', e);
        Modal.error({ title: '添加失败', content: '获取数据失败，请检查ID是否正确', open: true });
      } finally {
        loading.value = false;
      }
    };

    const removeFromChart = (id: number) => {
      compareChartData.value = compareChartData.value.filter(item => item.id !== id);
      if (chartInstance) {
        const option = chartInstance.getOption() as {
          series: Array<{ name: string }>
        };
        option.series = option.series.filter(s => s.name !== `ID ${id}`);
        chartInstance.setOption(option, true);
      }
    };

    const handleResize = () => {
      if (chartInstance) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => chartInstance?.resize(), 200);
      }
    };

    const handleChartClose = () => {
      chartInstance?.dispose();
      chartInstance = null;
      compareChartData.value = [];
    };

    onMounted(async () => {
      window.addEventListener('resize', handleResize);
      await fetchData();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      chartInstance?.dispose();
    });

    return {
      dataList,
      loading,
      error,
      chartRef,
      chartVisible,
      formatDate,
      formatData,
      showChart,
      handleSearch,
      handleCompare,
      currentPage,
      total,
      pageSize,
      handlePageChange,
      compareId1,
      compareId2,
      newCompareId,
      addToChart,
      removeFromChart,
      handleChartClose,
      compareChartData
    };
  }
});
</script>

<style scoped>
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
