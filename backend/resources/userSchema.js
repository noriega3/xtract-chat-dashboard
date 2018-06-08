const Chance = require('chance')
let chance = new Chance()
//WIP - predefined with sensitive info removed from private.
//TODO: fix up db structure for self hosted
const schema = {
    "type": "object",
    "properties": {
       " _lastApp": {
            "type": "string",
        },
        "_accountId": {
            "type": "string"
        },
        "data:source:lastSyncTime": {
            "type": "string"
        },
        "data:source:level": {
            "type": "string"
        },
        "_emailAddress": {
            "type": "string",
            "faker": "internet.email"
        },
        "data:source:username": {
            "type": "string",
            "faker": "internet.userName"
        },
        "data:source:consecutiveDays": {
            "type": "string"
        },
        "_facebookId": {
            "type": "string",
            "faker": "random.uuid"
        },
        "_appSaves": {
            "type": "array",
            "properties": {}
        },
        "data:source:score": {
            "type": "string"
        },
        "data:source:avatar": {
            "type": "string"
        },
        "_type": {
            "type": "string"
        },
        "data:source": {
            "type": "object",
        }
    },
    "definitions": {
        "positiveInt": {
            "type": "integer",
            "minimum": 0,
            "exclusiveMinimum": true
        }
    }
}

module.exports = schema