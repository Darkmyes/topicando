import spacy
from collections import Counter
from spacy.matcher import Matcher
import pandas as pd
import numpy as np

class TopicandoV1:
    nlp = None
    phrases = []
    entities = []
    relations = []
    dictWords = {}
    
    def __init__(self, spacyLang, phrases):
        self.nlp = spacy.load(spacyLang)
        self.phrases = phrases
        self.entities = []
        self.relations = []
        self.dictWords = {}
    
    def getVectorizedPhrases(self):
        values = []
        for phrase in self.phrases:
            vector = np.zeros(300)
            doc = self.nlp(phrase)
            for token in doc:
                if not token.is_stop and not token.is_punct:
                    #print(token.text, token.pos_, token.dep_) #eliminar det
                    vector = vector + np.array(token.vector_norm)
            values.append(vector / len(doc))
        return np.array(values)

    def getMostUsedWordsInCorpus(self, useLemma = True):
        fullText = ""
        for phrase in self.phrases:
            fullText += (phrase + " ")
        doc = self.nlp(fullText)

        words = [(token.lemma_ if useLemma else token.text)
            for token in doc
            if not token.is_stop and not token.is_punct]

        word_freq = Counter(words)
        common_words = word_freq.most_common()
        return common_words
    
    def getWordCountOfEntitiesAndRelations(self):
        dictWords = {}
        for entitiesPair in self.entities:
            for word in entitiesPair:
                if word not in dictWords.keys():
                    dictWords[word] = 1
                else:
                    dictWords[word] += 1
        for relations in self.relations:
            for word in relations:
                if word not in dictWords.keys():
                    dictWords[word] = 1
                else:
                    dictWords[word] += 1

        self.dictWords = dictWords
        return dictWords

    def getMostUsedWordsOfEntitiesAndRelations(self, useLemma = True):
        self.getWordCountOfEntitiesAndRelations()
        return dict(sorted(self.dictWords.items(), key=lambda item: item[1], reverse=True))
    
    def searchEntitiesAndRelations(self):
        self.entities = []
        for phrase in self.phrases:
            self.entities.append(self.__getEntities(phrase))
        
        self.relations = []
        for phrase in self.phrases:
            self.relations.append(self.__getRelations(phrase))
    
    def getSourceEdgeTargetDataFrame(self,sourcesToSearch=[], edgesToSearch=[], targetsToSearch=[]):
        phraseLength = len(self.entities)
        sources = []
        targets = []
        edges = []
        
        for index in range(0, phraseLength):
            for relation in self.relations[index]:
                source = self.entities[index][0]
                target = self.entities[index][1]

                if (len(sourcesToSearch) + len(targetsToSearch) + len(edgesToSearch)) == 0 or (relation in edgesToSearch or source in sourcesToSearch or target in targetsToSearch):
                    sources.append(self.entities[index][0])
                    targets.append(self.entities[index][1])
                    edges.append(relation)

        sourceEdgeTargetDataframe = pd.DataFrame({'source':sources, 'target':targets, 'edge':edges})
        return sourceEdgeTargetDataframe
    
    def getSourcesEdgesTargetsEdgesArray(self, sourcesToSearch=[], edgesToSearch=[], targetsToSearch=[]):
        phraseLength = len(self.entities)
        data = []
        
        for index in range(0, phraseLength):
            for relation in self.relations[index]:
                source = self.entities[index][0]
                target = self.entities[index][1]

                if (len(sourcesToSearch) + len(targetsToSearch) + len(edgesToSearch)) == 0 or (relation in edgesToSearch or source in sourcesToSearch or target in targetsToSearch):
                    if source != '':
                        data.append([source, relation])
                    if target != '':
                        data.append([target, relation])

        return data
    
    def getSourcesTargetsArray(self, sourcesToSearch=[], edgesToSearch=[], targetsToSearch=[]):
        phraseLength = len(self.entities)
        data = []
        
        for index in range(0, phraseLength):
            for relation in self.relations[index]:
                source = self.entities[index][0]
                target = self.entities[index][1]

                if (len(sourcesToSearch) + len(targetsToSearch) + len(edgesToSearch)) == 0 or (relation in edgesToSearch or source in sourcesToSearch or target in targetsToSearch):
                    if source != '' and target != '':
                        data.append([source, target])

        return data

    def getSourceEdgeTargetEdgeDataFrame(self, sourcesToSearch=[], edgesToSearch=[], targetsToSearch=[]):
        phraseLength = len(self.entities)
        sources = []
        targets = []
        edges = []
        
        for index in range(0, phraseLength):
            for relation in self.relations[index]:
                source = self.entities[index][0]
                target = self.entities[index][1]

                if (len(sourcesToSearch) + len(targetsToSearch) + len(edgesToSearch)) == 0 or (relation in edgesToSearch or source in sourcesToSearch or target in targetsToSearch):
                    if source != '':
                        sources.append(self.entities[index][0])
                        targets.append(relation)
                        edges.append(relation)
                    if target != '':
                        sources.append(self.entities[index][1])
                        targets.append(relation)
                        edges.append(relation)

        sourceEdgeTargetDataframe = pd.DataFrame({'source':sources, 'target':targets, 'edge':edges})
        return sourceEdgeTargetDataframe

    def __getRelations(self, phrase):
        doc = self.nlp(phrase)

        matcher = Matcher(self.nlp.vocab)
        pattern = [
            {'POS':'VERB','OP':"?"},
            {'POS':'AUX','OP':"?"},
        ]

        matcher.add("matching_1", [pattern]) 
        matches = matcher(doc)

        if len(matches) == 0:
            return ["haber"]

        return [doc[match[1]:match[2]].lemma_ for match in matches]

    def __getEntities(self, phrase):
        ent1 = ""
        ent2 = ""

        prv_tok_dep = ""    
        prv_tok_text = ""   

        prefix = ""
        modifier = ""

        prv_token = None

        tokens = []

        for tok in self.nlp(phrase):
            if tok.dep_ != "punct":
                if tok.dep_ == "compound":
                    prefix = tok.text
                if prv_tok_dep == "compound":
                    prefix = prv_tok_text + " "+ tok.text
                if tok.dep_.endswith("mod") == True:
                    modifier = tok.text
                if prv_tok_dep == "compound":
                    modifier = prv_tok_text + " "+ tok.text
                if (tok.dep_.find("subj") == True or tok.dep_ == "subj") and tok.pos_ != "PRON":
                    ent1 = modifier + " " + prefix + " "+ tok.lemma_
                    prefix = ""
                    modifier = ""
                    prv_tok_dep = ""
                    prv_tok_text = ""
                    tokens.append(ent1)
                if tok.dep_.find("obj") == True:
                    ent2 = modifier + " " + prefix + " " + tok.lemma_
                    tokens.append(ent2)
                if tok.dep_ == "obj":
                    ent2 = tok.lemma_
                    tokens.append(ent2)
                if ent1.strip() == "" and ent2.find(tok.lemma_) == -1:
                    if tok.dep_.find("mod") == True and tok.pos_ == "ADJ":
                        ent1 = tok.lemma_
                        tokens.append(ent1)
                    if tok.pos_ == "NOUN":
                        ent1 = tok.lemma_
                        tokens.append(ent1)
                if ent2.strip() == "" and ent1.find(tok.lemma_) == -1:
                    if tok.dep_.find("mod") == True and tok.pos_ == "ADJ":
                        ent2 = tok.lemma_
                        tokens.append(ent2)
                    if tok.pos_ == "ADJ":
                        ent2 = tok.lemma_
                        tokens.append(ent2)
                    if tok.pos_ == "NOUN":
                        ent2 = tok.lemma_
                        tokens.append(ent2)
                    if (prv_token != None and prv_token.pos_ == "AUX") and (tok.pos_ == "VERB" or tok.pos_ == "ADJ"):
                        ent2 = tok.lemma_
                        tokens.append(ent2)
                prv_tok_dep = tok.dep_
                prv_tok_text = tok.text
                prv_token = tok

        #return [token.strip() for  token in tokens]
        return [ent1.strip(), ent2.strip()]