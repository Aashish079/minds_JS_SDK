const MindsClient = require('minds_js_sdk');

const client = new MindsClient("APIKEY");

client.minds.get('my_mind')
    .then(mind => mind.completion({ message: "Hello, how are you?" }))
    .then(response => console.log('Chat response:', response))
    .catch(error => console.error('Error in chat completion:', error));

// For streaming responses
client.minds.get('my_mind')
    .then(mind => mind.completion({ message: "Tell me a story", stream: true }))
    .then(stream => {
        stream.on('data', (chunk) => console.log(chunk.toString()));
        stream.on('end', () => console.log('Stream ended'));
    })
    .catch(error => console.error('Error in streaming chat completion:', error));