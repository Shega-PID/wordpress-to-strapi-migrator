"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJsonStructure = void 0;
const path = require("path");
const fs = require('fs');
const fetchJsonStructure = async () => {
    const jsonPath = path.join('./map-strapi-towordpress.json');
    const jsonFile = fs.readFileSync(jsonPath, 'utf8');
    const jsonData = JSON.parse(jsonFile);
    return jsonData;
};
exports.fetchJsonStructure = fetchJsonStructure;
