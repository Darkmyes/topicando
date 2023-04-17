from flask import Flask, send_from_directory, request, jsonify
import json
from topicando import TopicandoV1
import numpy as np

modelLang = "es_core_news_lg"

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory("static", "index.html")

@app.route('/api/proccess', methods = ['POST'])
def process():
    phrases = request.json

    topicando = TopicandoV1(modelLang, phrases)

    mostUsedInCorpus = topicando.getMostUsedWordsInCorpus(useLemma = True)
    wordCount = topicando.getWordCountOfEntitiesAndRelations()

    topicando.searchEntitiesAndRelations()
    mostUsedInRelations = topicando.getMostUsedWordsOfEntitiesAndRelations()

    sdt = topicando.getSourceEdgeTargetDataFrame()
    sources = np.array(sdt["source"].values).tolist()
    edges = np.array(sdt["edge"].values).tolist()
    targets = np.array(sdt["target"].values).tolist()

    return jsonify({
        "most_used_corpus" : mostUsedInCorpus,
        "most_used_relations" : mostUsedInRelations,
        "word_count" : wordCount,

        "sources" : sources,
        "edges" : edges,
        "targets" : targets,
    })

@app.route('/api/chart_data', methods = ['POST'])
def chart_data():
    phrases = request.json

    topicando = TopicandoV1(modelLang, phrases)
    topicando.searchEntitiesAndRelations()
    wordCount = topicando.getWordCountOfEntitiesAndRelations()

    chart_data = []
    nodes_filtered = []

    #for i in topicando.getSourcesTargetsArray():
    for i in topicando.getSourcesEdgesTargetsEdgesArray():
        if i[0] not in nodes_filtered:
            nodes_filtered.append(i[0])
        if i[1] not in nodes_filtered:
            nodes_filtered.append(i[1])
        chart_data.append([i[0],i[1]])

    arrayWordsCounts = [topicando.dictWords[word] for word in topicando.dictWords.keys() if word != '' and word in nodes_filtered]

    valMin = min(arrayWordsCounts)
    valMax = max(arrayWordsCounts)

    valMinNormalized = 5
    valMaxNormalized = 50

    nodes = []
    for word in topicando.dictWords.keys():
        if word != '' and word in nodes_filtered:
            nodes.append({
                "id": word,
                "marker": {
                    "count": topicando.dictWords[word],
                    "radius": np.interp(topicando.dictWords[word],[valMin,valMax],[valMinNormalized,valMaxNormalized])
                }
            })

    return jsonify({
        "chart_data" : chart_data,
        "nodes" : nodes,
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)