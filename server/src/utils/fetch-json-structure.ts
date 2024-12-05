const path = require("path");
const fs = require('fs');

export const fetchJsonStructure = async() =>{
    const jsonPath=path.join('./map-strapi-towordpress.json')
    const jsonFile=fs.readFileSync(jsonPath,'utf8');
    const jsonData=JSON.parse(jsonFile)
    return jsonData
}