const messageTypes = require('../config/messageTypes');
const knowledge = require('../config/knowledge')

let today = new Date()
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
let date = new Date().toISOString().slice(0, 10)

const commonPhrases = {
    "what is up": "What's up",
    "what is your name": "I don't have one, I'm just a program. But you can call me Jack",
    "what time is it": time,
    "what is the time": time,
    "tell me the current time": time,
    "what date is it": date,
    "what is the date": date,
    "what day is it": date,
    "tell me the current date": date,
    "how are you": "I'm fine, thanks. And you?",
    "how are you doing": "Great, thanks. And you?",
    "i am fine": "Glad to hear that. Anything interesting happened?",
    "i am good": "Glad to hear that. Anything interesting happened?",
    "i am great": "Glad to hear that. Anything interesting happened?",
    "i am good": "Glad to hear that. Anything interesting happened?",
}

const greatings = [
    'Hi!', 'Hello!'
]

const farewells = [
    'Bye!', 'Good bye!', 'Bye-bye!', 'See you!'
]

const typeOfQuestion = {
    'what': 1,
    'where': 1,
    'when': 1,
    'how': 1,

    'do': 2,
    'does': 2,
    // the same as 2, but modals
    'can': 3,
    'could': 3,
    'should': 3,
    'must': 3,
    'may': 3,
    'is': 3,
    'are': 3,
    'have': 3,
    'has': 3,
}

const activePronouns = {
    'i': 'you',
    'me': 'you',
    'you': 'I',
    'he': 'he',
    'she': 'she',
    'they': 'they',
    'we': 'you',
}

const pronouns = {
    'i': 'you',
    'me': 'you',
    'you': 'I',
    'he': 'he',
    'she': 'she',
    'they': 'they',
    'we': 'you',
    'my': 'your',
    'your': 'my',
    'ours': 'your',
    'mine': 'yours',
    'yours': 'mine',
    'am': 'are',
    'are': 'am',
}

const phrasesQuestionPositive = [
    'Yes', 'Probably', 'Maybe', 'For sure'
]

const phrasesQuestionNegative = [
    'No', 'Of course no', 'No way'
]

const phrasesStatement = [
    'Hmm, that\'s interesting. Could you tell me more about this?',
    'Interesting. What else do you know about it?',
    'Sounds interesting'
]

function produceResponse(message, type) {
    let messageForCommon = message.replace(/n't/g, ' not').replace(/'s/g, ' is').replace(/'re/g, ' are').replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').toLowerCase()
    if (commonPhrases[messageForCommon]) return commonPhrases[messageForCommon]

    switch (type) {
        case messageTypes.GREATING:
            return greatings[Math.floor(Math.random()*greatings.length)];
        case messageTypes.FAREWELL:
            return farewells[Math.floor(Math.random()*farewells.length)];
        case messageTypes.QUESTION:
            return handleQuestion(message)
        case messageTypes.LIKE:
        case messageTypes.DISLIKE:
            return handleOpinion(message, type)
        case messageTypes.STATEMENT:
            return handleStatement()
        default:
            return 'Hmmm...'
    }
}

const constructQuestionReply = (object, questionWord, sense, type) => {
    let positiveAnswer = (Math.random() > 0.5)

    return (positiveAnswer) ? 
        `${phrasesQuestionPositive[Math.floor(Math.random()*phrasesQuestionPositive.length)]}, ${object} ${(type === 3) ? `${questionWord}` : ''} ${sense}.` :
        `${phrasesQuestionNegative[Math.floor(Math.random()*phrasesQuestionNegative.length)]}, ${object} ${questionWord} not.`
}

const getTypeOfQuestion = (question) => {
    const words = question.split(' ');
    for (let word of words) {
        if (typeOfQuestion[word.toLowerCase()]) return [ typeOfQuestion[word.toLowerCase()], words.indexOf(word) ];
    }
    return [ null, null ];
}

const handleQuestion = (question) => {
    question = question.replace(/n't/g, ' not').replace(/'s/g, ' is').replace(/'re/g, ' are')
    
    let [ type, indexOfQuestionWord ] = getTypeOfQuestion(question)
    if (!type) return 'Didn\'t get the question. Could you rephrase it, please?'

    if (type === 1) {
        return 'I don\'t know. Try googling it.'
    }
    if (type === 2 || type === 3) {
        let object = null, sense = '', 
            words = question.split(' '),
            questionWord = words[indexOfQuestionWord].toLowerCase()

        for (let i = indexOfQuestionWord; i < words.length; i++) {
            if (activePronouns[words[i].toLowerCase()]) {
                object = activePronouns[words[i].toLowerCase()]
                sense = words.slice(i+1).join(' ')
                sense = sense.replace(/[?]/g, '')
                break;
            }
        }

        if (!object) return 'Didn\'t get the question. Could you rephrase it, please?'

        sense = sense.split(' ').map(word => (pronouns[word.toLowerCase()]) ? pronouns[word.toLowerCase()] : word).join(' ');
        if (questionWord === 'are' && object === 'I') questionWord = 'am';

        return constructQuestionReply(object, questionWord, sense, type)
    }
}

const constructOpinionReply = (verb, sense, type) => {
    console.log(verb, sense, type)
    if (type === messageTypes.DISLIKE && knowledge[verb] === messageTypes.LIKE) verb = 'dislike'
    else if (type === messageTypes.LIKE && knowledge[verb] === messageTypes.DISLIKE) verb = 'like'
    const variants = [
        `I also ${verb} ${sense}`,
        (knowledge[verb] === messageTypes.LIKE) ? `As for me, I also ${verb} ${sense}` : `Why don't you like ${sense}?`,
        'Oh, really? Why?'
    ]

    return variants[Math.floor(Math.random()*variants.length)]
}

const handleOpinion = (message, type) => {
    let verb = null, sense = '', 
    words = message.split(' ')

    for (let i = 0; i < words.length; i++) {
        if (knowledge[words[i]] === messageTypes.DISLIKE || knowledge[words[i]] === messageTypes.LIKE) {
            verb = words[i]
            sense = words.slice(i+1).join(' ')
        }
    }

    if (verb && !sense) return `What exactly do you ${verb}?`

    return constructOpinionReply(verb, sense, type)
}

const handleStatement = () => phrasesStatement[Math.floor(Math.random()*phrasesStatement.length)]


module.exports = produceResponse;