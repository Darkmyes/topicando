# Topicando (ALPHA)

Topicando es un proyecto que busca ayudar a obtener los tópicos de una gran cantidad de frases, mostrar un ranking de palabras más utilizadas y grafos de las palabras y sus relaciones.

## Instalación

```bash
pip install pandas spacy numpy unidecode nltk collections spacy
```
import spacy
from unidecode import unidecode
from string import punctuation 
from nltk.corpus import stopwords
from collections import Counter
from spacy.matcher import Matcher
import pandas as pd