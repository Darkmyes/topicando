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
    legend: {

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
            analisisModes: Vue.ref([
                'Source, Target',
                'Source, Edge, Target'
            ]),
            analisisMode: Vue.ref('Source, Target'),
            loadingProcess: Vue.ref(false),
            procesedInfo: Vue.ref({}),

            dialogFilter: Vue.ref(false),
            sourceEdgeTargetColumns: Vue.ref([
                { name: 'text', align: 'left', label: 'Text', field: row => row[0], sortable: true },
                { name: 'count', label: 'Count', field: row => row[1], sortable: true }
            ]),
            selectedSources: Vue.ref([]),
            selectedEdges: Vue.ref([]),
            selectedTargets: Vue.ref([]),
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

                    let sources = []
                    for (var name in res.data.sources) {
                        sources.push([name, res.data.sources[name]])
                    }
                    this.procesedInfo.sources = sources.sort((a, b) => a[1] > b[1] ? -1 : 1)

                    let edges = []
                    for (var name in res.data.edges) {
                        edges.push([name, res.data.edges[name]])
                    }
                    this.procesedInfo.edges = edges.sort((a, b) => a[1] > b[1] ? -1 : 1)

                    let targets = []
                    for (var name in res.data.targets) {
                        targets.push([name, res.data.targets[name]])
                    }
                    this.procesedInfo.targets = targets.sort((a, b) => a[1] > b[1] ? -1 : 1)

                    this.loadingProcess = false
                })
                .catch(err => {
                    this.loadingProcess = false
                    console.log(err)
                })
        },
        getChartData () {
            this.loadingProcess = true
            this.step = 2

            axios.post("/api/chart_data", {
                analisisMode: this.analisisMode,
                data: this.csvData.dataframe.column(this.csvData.csvColumn).values.filter(val => val != null)
            } )
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