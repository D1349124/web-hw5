<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
);

const formData = ref({
  provider: '',
  name: '',
  price: '',
  date: '',
  source: ''
});

const message = ref({ text: '', type: '' });
const items = ref([]);
const searchQuery = ref('');

const fetchData = async () => {
  try {
    const url = searchQuery.value 
      ? `/api/quotes?keyword=${encodeURIComponent(searchQuery.value)}` 
      : '/api/quotes';
    const response = await axios.get(url);
    items.value = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const submitForm = async () => {
  message.value = { text: '正在進行傳輸...', type: 'loading' };
  try {
    const postData = {
      ...formData.value,
      provider: formData.value.provider || '系統預設'
    };
    const response = await axios.post('/api/insert', postData);
    if (response.status === 200) {
      message.value = { text: 'SUCCESS: 資料已寫入資料庫', type: 'success' };
      setTimeout(() => message.value = { text: '', type: '' }, 3000);
      fetchData();
      formData.value = { provider: '', name: '', price: '', date: '', source: '' };
    }
  } catch (error) {
    message.value = { text: 'ERROR: 傳輸中斷', type: 'error' };
  }
};

const chartData = computed(() => {
  const dates = [...new Set(items.value.map(d => d.date))];
  const railwayData = items.value.filter(d => d.name.includes('台鐵'));
  const marketData = items.value.filter(d => d.name.includes('市場均價'));

  return {
    labels: dates,
    datasets: [
      {
        label: '台鐵便當',
        data: dates.map(date => {
          const found = railwayData.find(d => d.date === date);
          return found ? found.price : null;
        }),
        borderColor: '#0f172a',
        backgroundColor: 'rgba(15, 23, 42, 0.05)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#0f172a',
        tension: 0.2,
        spanGaps: true
      },
      {
        label: '市場均價',
        data: dates.map(date => {
          const found = marketData.find(d => d.date === date);
          return found ? found.price : null;
        }),
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.05)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#94a3b8',
        tension: 0.2,
        borderDash: [5, 5],
        spanGaps: true
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        font: { family: 'Noto Sans TC', size: 11, weight: 'bold' },
        padding: 20
      }
    }
  },
  scales: {
    y: {
      grid: { color: '#f1f5f9' },
      ticks: { font: { family: 'JetBrains Mono', size: 10 } }
    },
    x: {
      grid: { display: false },
      ticks: { font: { family: 'JetBrains Mono', size: 10 } }
    }
  }
};

const sortedItems = computed(() => {
  return [...items.value].reverse();
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="min-h-screen pb-20 text-slate-800">
    <header class="py-16 border-b border-slate-200 bg-white">
      <div class="container mx-auto px-4 text-center">
        <div class="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-slate-500 border border-slate-200 rounded">
          DATA ANALYSIS PROJECT (Vue Version)
        </div>
        <h1 class="text-4xl font-bold mb-4 tracking-tight text-slate-900">
          台灣便當物價觀測系統
        </h1>
        <p class="text-slate-500 max-w-xl mx-auto text-base">
          長期追蹤市場民生物價變動，透過數據可視化分析通膨對社會生活成本之影響。
        </p>
      </div>
    </header>

    <main class="container mx-auto px-4 max-w-7xl mt-12">
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        <aside class="xl:col-span-4 animate-fade">
          <div class="bg-white p-8 rounded border border-slate-200 shadow-sm">
            <h2 class="text-lg font-bold mb-8 flex items-center text-slate-900 uppercase tracking-wider">
              數據錄入
            </h2>
            <form @submit.prevent="submitForm" class="space-y-6 text-sm">
              <div class="space-y-2">
                <label class="font-bold text-slate-700">資料來源機構</label>
                <input v-model="formData.provider" type="text" placeholder="請輸入來源名稱" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-slate-900 outline-none transition-all">
              </div>
              <div class="space-y-2">
                <label class="font-bold text-slate-700">品項名稱</label>
                <input v-model="formData.name" type="text" required placeholder="例如：台鐵排骨便當" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-slate-900 outline-none transition-all">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="font-bold text-slate-700">市場價格 (TWD)</label>
                  <input v-model="formData.price" type="number" required placeholder="0" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono">
                </div>
                <div class="space-y-2">
                  <label class="font-bold text-slate-700">觀測日期</label>
                  <input v-model="formData.date" type="date" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-slate-900 outline-none transition-all">
                </div>
              </div>
              <div class="space-y-2">
                <label class="font-bold text-slate-700">原始資料網址</label>
                <input v-model="formData.source" type="url" required placeholder="https://..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-slate-900 outline-none transition-all">
              </div>
              <button type="submit" class="btn-submit w-full text-white font-bold py-4 rounded shadow-sm uppercase tracking-widest text-xs">
                確認送出
              </button>
            </form>
            <p v-if="message.text" :class="['mt-4 text-center text-xs h-4', message.type === 'error' ? 'text-red-600 font-bold' : message.type === 'success' ? 'text-slate-900 font-bold' : 'text-slate-400']">
              {{ message.text }}
            </p>
          </div>
        </aside>

        <section class="xl:col-span-8 space-y-10 animate-fade">
          
          <div class="bg-white p-8 rounded border border-slate-200 shadow-sm">
            <h2 class="text-lg font-bold mb-8 text-slate-900 uppercase tracking-wider">
              價格走勢分析
            </h2>
            <div class="relative h-80">
              <Line :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <div class="bg-white p-8 rounded border border-slate-200 shadow-sm">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <h2 class="text-lg font-bold text-slate-900 uppercase tracking-wider">
                歷史觀測紀錄
              </h2>
              <div class="flex items-center gap-2 w-full md:w-auto">
                <input v-model="searchQuery" @keyup.enter="fetchData" type="text" placeholder="搜尋項目..." class="w-full md:w-48 px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all">
                <button @click="fetchData" class="px-6 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-all text-xs font-bold border border-slate-200">
                  查詢
                </button>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-slate-900 text-slate-900 text-xs font-bold uppercase tracking-widest">
                    <th class="px-2 py-4">DATE</th>
                    <th class="px-4 py-4">ITEM / PROVIDER</th>
                    <th class="px-4 py-4 text-right">UNIT PRICE</th>
                    <th class="px-4 py-4 text-center">LINK</th>
                  </tr>
                </thead>
                <tbody class="text-sm divide-y divide-slate-100">
                  <tr v-for="row in sortedItems" :key="row.id" class="hover:bg-slate-50 transition-colors">
                    <td class="px-2 py-5 font-mono text-xs text-slate-400">{{ row.date }}</td>
                    <td class="px-4 py-5">
                      <div class="font-bold text-slate-800">{{ row.name }}</div>
                      <div class="text-[10px] text-slate-400 uppercase tracking-tighter mt-1">{{ row.provider }}</div>
                    </td>
                    <td class="px-4 py-5 text-right font-mono font-bold text-slate-900 italic">
                      TWD {{ row.price }}
                    </td>
                    <td class="px-4 py-5 text-center">
                        <a :href="row.source" target="_blank" class="text-[10px] font-bold border-b border-slate-300 hover:border-slate-900 text-slate-400 hover:text-slate-900 transition-all uppercase">
                          View
                        </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </div>
    </main>
  </div>
</template>
