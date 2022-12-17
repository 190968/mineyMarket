<template>
    <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
        :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
</template>
<script>
import { Bar } from 'vue-chartjs';
import axios from "axios";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
export default {
    name: 'BarChart',
    components: { Bar },
    props:  {
        item: {
            type: String,
            default:''
        },
        chartId: {
            type: String,
            default: 'bar-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
        },
        width: {
            type: Number,
            default: 'auto'
        },
        height: {
            type: Number,
            default: 300
        },
        cssClasses: {
            default: '',
            type: String
        },
        styles: {
            type: Object,
            default: () => { }
        },
        plugins: {
            type: Object,
            default: () => { }
        },
       
    },
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [{label: this.item.toUpperCase(), backgroundColor: 'yellow', data: [] }],

            },
            chartOptions: {
                responsive: true
            }
        }
    },
    mounted() { 
        axios
        .get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${this.item}&tsym=USD&limit=10`)
        .then(res => {
            console.log(res.data.Data.Data.map(i=> i.close));
            this.chartData.labels = res.data.Data.Data.map(i=> (new Date(i.time)).toLocaleTimeString('en-US'))
            this.chartData.datasets[0].data = res.data.Data.Data.map(i=> i.close)
        });

    },
    watch: {
        item() {
            axios
            .get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${this.item}&tsym=USD,EUR&limit=10`)
            .then(res => {
                console.log(res.data.Data.Data.map(i=> i.close));
                this.chartData.labels = res.data.Data.Data.map(i=> (new Date(i.time)).toLocaleTimeString('en-US'))
                this.chartData.datasets[0].data = res.data.Data.Data.map(i=> i.close)
            });
        }
    }
}

</script>