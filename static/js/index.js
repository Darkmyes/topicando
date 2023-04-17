let chartOptions = {
    chart: {
        type: 'networkgraph',
        height: '100%'
        },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
        tooltip: {
    formatter: function () {
        console.log(this)
        return "<b>" + this.key + "</b>: " + this.point.marker.count;
    }
},
    plotOptions: {
        networkgraph: {
            keys: ['from', 'to'],
            layoutAlgorithm: {
                enableSimulation: false,//true
                friction: -0.9
            }
        }
    },
    series: [{
        colorByPoint: true,
        accessibility: {
            enabled: false
        },
        dataLabels: {
            enabled: true,
            linkFormat: '',
        },
        id: 'lang-tree',
        data: [],
        nodes: []
    }]
}

const app = Vue.createApp({
    setup() {
        return {
            step: Vue.ref(1),
            csvData: Vue.ref({
                csvFile: null,
                csvColumn: "",
                csvColumns: [],
                dataframe: null,
            }),
            loadingProcess: Vue.ref(false),
            procesedInfo: Vue.ref({})
        }
    },
    methods: {
        loadCSV () {
            if (this.csvData.csvFile == null) {
                alert(null)
                return
            }

            dfd.readCSV(this.csvData.csvFile)
                .then(df => {
                    this.csvData.dataframe = df
                    this.csvData.csvColumns = df.columns
                    if (df.columns.length > 0) {
                        this.csvData.csvColumn = df.columns[0]
                    } else {
                        this.csvData.csvColumn = ""
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        proccessInfo () {
            this.loadingProcess = true
            this.step = 2

            axios.post("/api/proccess", this.csvData.dataframe.column(this.csvData.csvColumn).values.filter(val => val != null) )
                .then(res => {
                    this.procesedInfo = res.data
                    this.loadingProcess = false
                    this.getChartData()
                })
                .catch(err => {
                    this.loadingProcess = false
                    console.log(err)
                })
        },
        getChartData () {
            this.loadingProcess = true
            this.step = 2

            axios.post("/api/chart_data", this.csvData.dataframe.column(this.csvData.csvColumn).values.filter(val => val != null) )
                .then(res => {
                    this.loadingProcess = false

                    let chartDataOptions = chartOptions
                    chartDataOptions.series[0].nodes = res.data.nodes
                    chartDataOptions.series[0].data = res.data.chart_data

                    setTimeout(() => {
                        console.log(chartDataOptions)
                        Highcharts.chart('grafico', chartDataOptions )
                    }, 200);
                })
                .catch(err => {
                    this.loadingProcess = false
                    console.log(err)
                })
        }
    }
})

app.use(Quasar)
app.mount('#q-app')