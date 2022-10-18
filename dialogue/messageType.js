const messageTypes = require('../config/messageTypes')
const knowledge = require('../config/knowledge')

function getTypeOfInput(message) {
    const state = {
        'negative': false,
        'questionMark': message.indexOf('?') !== -1,
        'type': messageTypes.STATEMENT
    }

    message = message.toLowerCase().replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/n't/g, ' not').replace(/'s/g, ' is').replace(/'re/g, ' are')

    let words = message.split(' ')
    for (let word of words) {
        if (!knowledge[word]) continue;
        if (state.questionMark && knowledge[word] === messageTypes.QUESTION) {
            return messageTypes.QUESTION
        }
        if (knowledge[word] === messageTypes.FAREWELL) {
            return messageTypes.FAREWELL
        }
        if (knowledge[word] === messageTypes.NEGATIVE) {
            state.negative = !(state.negative)
        } 
        else if (knowledge[word] === messageTypes.LIKE) {
            state.type = (state.negative) ? messageTypes.DISLIKE : messageTypes.LIKE
        } 
        else if (knowledge[word] === messageTypes.DISLIKE) {
            state.type = (state.negative) ? messageTypes.LIKE : messageTypes.DISLIKE
        }
        else if (knowledge[word] === messageTypes.GREATING) {
            state.type = messageTypes.GREATING
        } 
        else if (knowledge[word] === messageTypes.MODAL) {
            if (words.indexOf(word) === 0 || state.questionMark) return messageTypes.QUESTION
        }
        else {
            state.type = messageTypes.STATEMENT
        }
    }
    
    return state.type
}

module.exports = getTypeOfInput;