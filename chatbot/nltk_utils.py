import nltk
import ssl
import numpy as np

# ---------------------------------------------------------------------------
# SI LE CODE EST EXECUTE POUR LA PREMIERE FOIS DECOMMENTEZ LE CODE CI-DESSOUS
# ---------------------------------------------------------------------------
"""
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

nltk.download('punkt_tab')
"""

from nltk.stem.porter import PorterStemmer
stemmer = PorterStemmer()

def tokenize(sentence) :
    """
    Transforme une chaine de caractère en liste de mots

    Args : 
        sentence (str) : Chaine de caractère

    Returns : 
        list : liste de mots a partir de la chane de caractères

    """
    return nltk.word_tokenize(sentence)

def stem(word) :
    return stemmer.stem(word.lower())

def bag_of_words(tokenized_sentence, all_words) :
    tokenized_sentence = [stem(w) for w in tokenized_sentence]
    bag = np.zeros(len(all_words), dtype=np.float32)
    for index, w in enumerate(all_words) :
        if w in tokenized_sentence : 
            bag[index] = 1.0

    return bag


"""
Exemple 
a = "Organiser Organisation Organe"
print(a) 
a = tokenize(a)
print(a) #input out : ['Organiser', 'Organisation', 'Organe']
a = [stem(w) for w in a]
print(a) #input out : ['organis', 'organis', 'organ']
"""