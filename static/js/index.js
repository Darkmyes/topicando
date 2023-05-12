import {
    CSS2DRenderer,
    CSS2DObject,
} from "//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js";

const show3DGraph = (nodes) => {
    const highlightNodes = new Set();
    const highlightLinks = new Set();
    let hoverNode = null;

    const Graph = ForceGraph3D({
        //controlType: 'orbit',
        extraRenderers: [new CSS2DRenderer()],
    })(document.getElementById("grafico"))
        //.jsonUrl("../datasets/miserables.json")
        .graphData(nodes)
        .backgroundColor('#f3f3f3')
        .nodeAutoColorBy("group")
        .nodeThreeObject((node) => {
            const nodeEl = document.createElement("div");
            nodeEl.textContent = `${node.id} (${node.count})`;
            nodeEl.style.color = node.color;
            nodeEl.className = "node-label";
            return new CSS2DObject(nodeEl);
        })
        .onNodeClick(node => {
            // Aim at node from outside it
            const distance = 150;
            const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

            const newPos = node.x || node.y || node.z
              ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
              : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

            Graph.cameraPosition(
              newPos, // new position
              node, // lookAt ({ x, y, z })
              2000  // ms transition duration
            );
        })
        .nodeThreeObjectExtend(true)
        .linkThreeObjectExtend(true)
        .linkThreeObject(link => {
            // extend link with text sprite
            const sprite = new SpriteText(`${link.val}`);
            sprite.color = '#757373';
            sprite.textHeight = 4;
            return sprite;
        }).linkPositionUpdate((sprite, { start, end }) => {
            const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
              [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
            })));

            // Position sprite
            Object.assign(sprite.position, middlePos);
        })
        .linkWidth(link => 4)
        .linkOpacity(link =>0.8 );

        elementResizeDetectorMaker().listenTo(
            document.getElementById('grafico'),
            el => Graph.width(el.offsetWidth).height(el.offsetHeight)
        );
}

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
    }],
    nodesToShow: {
        nodes: [],
        links: []
    }
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

            fullScreenMode: Vue.ref(false)
        }
    },
    mounted () {
        document.addEventListener("fullscreenchange", () => {
            this.fullScreenMode = document.fullscreenElement
        });
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
                        //Highcharts.chart('grafico', chartDataOptions )
                        let newNodes = this.convertNodes(res.data.chart_data, res.data.nodes)
                        show3DGraph(newNodes);
                    }, 200);
                })
                .catch(err => {
                    this.loadingProcess = false
                    console.log(err)
                })
        },
        convertNodes (links, nodes) {
            let newNodes = []
            let newLinks = []

            let group = 0;

            newNodes = nodes.map(node => {
                group ++

                return {
                    id: node.id,
                    nombre: node.id,
                    val: node.marker.radius,
                    count: node.marker.count,
                    group: group
                }
            })

            links.forEach(node => {
                let itemLink = newLinks.find(nod => nod.source == node[0] && nod.target == node[1])
                if (!itemLink) {
                    newLinks.push({
                        source: node[0],
                        target: node[1],
                        val: 1
                    })
                } else {
                    itemLink.value++
                }
            })

            return {
                nodes: newNodes,
                links: newLinks,
            }
        },
        convertNodesOld (links, nodes) {
            let newNodes = []
            let newLinks = []

            let group = 1;

            links.forEach(node => {
                let itemSource = newNodes.find(nod => nod.id == node[0])
                if (!itemSource) {
                    newNodes.push({
                        id: node[0],
                        nombre: node[0],
                        value: 1,
                        group: group
                    })
                    group++
                } else {
                    itemSource.value ++
                }

                let itemTarget = newNodes.find(nod => nod.id == node[1])
                if (!itemTarget) {
                    newNodes.push({
                        id: node[1],
                        nombre: node[1],
                        value: 1,
                        group: group
                    })
                    group++
                } else {
                    itemTarget.value ++
                }

                let itemLink = newLinks.find(nod => nod.source == node[0] && nod.target == node[1])
                if (!itemLink) {
                    newLinks.push({
                        source: node[0],
                        target: node[1],
                        value: 1
                    })
                } else {
                    itemLink.value++
                }
            })

            /* links.forEach(node => {
                let itemLink = newLinks.find(nod => nod.source == node[0] && nod.target == node[1])
                if (!itemLink) {
                    newLinks.push({
                        source: node[0],
                        target: node[1],
                        value: 1
                    })
                } else {
                    itemLink.value++
                }
            }) */

            return {
                nodes: newNodes,
                links: newLinks,
            }
        },

        toggleFullScreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
})

app.use(Quasar)
app.mount('#q-app')