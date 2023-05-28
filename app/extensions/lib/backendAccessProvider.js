"use strict";

process.env && process.env.ACCESS_ATTRIBUTES || process.exit(1);
const apiKey = JSON.parse(process.env.ACCESS_ATTRIBUTES).api_key;

apiKey || process.exit(1);


function getAccessHeaders() {
    return {"x-api-key": apiKey};
}

module.exports = {
    getAccessHeaders
}