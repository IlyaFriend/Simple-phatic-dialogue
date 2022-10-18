const prompt = require("prompt-sync")({ sigint: true });
const getTypeOfInput = require('./dialogue/messageType');
const messageTypes = require("./config/messageTypes");
const produceResponse = require('./dialogue/response');

function main() {
    console.log('Start the conversation.\n\n');
    while (true) { 
        let input = prompt('');
        
        const type = getTypeOfInput(input);

        console.log('>',produceResponse(input, type));
        if (type === messageTypes.FAREWELL) break;
    }
}

main();