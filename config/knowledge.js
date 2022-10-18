const messageTypes = require('./messageTypes')

module.exports = {
    "hi": messageTypes.GREATING,
    "hello": messageTypes.GREATING,

    "like": messageTypes.LIKE,
    "love": messageTypes.LIKE,
    "prefer": messageTypes.LIKE,

    "dislike": messageTypes.DISLIKE,
    "hate": messageTypes.DISLIKE,

    "bye": messageTypes.FAREWELL,
    "byebye": messageTypes.FAREWELL,

    "do": messageTypes.QUESTION,
    "does": messageTypes.QUESTION,
    "don't": messageTypes.QUESTION,
    "doesn't": messageTypes.QUESTION,
    "what": messageTypes.QUESTION,
    "what's": messageTypes.QUESTION,
    "who": messageTypes.QUESTION,
    "who's": messageTypes.QUESTION,
    "where": messageTypes.QUESTION,
    "where's": messageTypes.QUESTION,
    "how": messageTypes.QUESTION,
    "how's": messageTypes.QUESTION,

    "can": messageTypes.MODAL,
    "could": messageTypes.MODAL,    
    'should': messageTypes.MODAL,
    'must': messageTypes.MODAL,
    'may': messageTypes.MODAL,
    'is': messageTypes.MODAL,
    'are': messageTypes.MODAL,
    'have': messageTypes.MODAL,
    'has': messageTypes.MODAL,

    "not": messageTypes.NEGATIVE,
}