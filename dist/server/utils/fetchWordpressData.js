"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJsonData = exports.fetchToken = void 0;
const axios_1 = __importDefault(require("axios"));
const path = require('path');
const fs = require('fs');
async function fetchToken() {
    let token = '';
    const username = process.env.WORDPRESS_USERNAME;
    const password = process.env.WORDPRESS_PASSWORD;
    const url = process.env.WORDPRESS_TOKEN_URL;
    const res = await axios_1.default.post(`${url}?username=${username}&password=${password}`, {}, { withCredentials: false });
    if (res && res.data && res.data.data && res.data.data.token) {
        token = res.data.data.token;
    }
    else {
        console.error('Unexpected response structure:', res);
    }
    return token;
}
exports.fetchToken = fetchToken;
async function fetchWordpressData(page, batch, restApi) {
    const token = await fetchToken();
    const url = `${process.env.CONTENT_URL}/${restApi}`;
    if (token) {
        try {
            const response = await axios_1.default.get(url, {
                params: {
                    per_page: batch !== null && batch !== void 0 ? batch : 10,
                    page: page,
                    // 'X-WP-Nonce': 'wp_rest'
                },
                timeout: 3600000,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const totalPages = parseInt(response.headers["x-wp-totalpages"], batch !== null && batch !== void 0 ? batch : 10);
            return {
                data: response.data,
                totalPages: totalPages
            };
        }
        catch (error) {
            console.log(error.message || (error === null || error === void 0 ? void 0 : error.stack));
            return {
                data: [],
                totalPages: 0
            };
        }
    }
    else {
        return { data: [], totalPages: 0 };
    }
}
async function fetchJsonData(page, filePath, batch, stopPage) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const allUsers = JSON.parse(fileContent);
        const start = (page - 1) * batch;
        const end = stopPage * batch;
        const paginatedUsers = allUsers.slice(start, end);
        const totalPages = Math.ceil(allUsers.length / batch);
        return {
            data: paginatedUsers,
            totalPages,
        };
    }
    catch (error) {
        throw new Error('Error reading or parsing the JSON file');
    }
}
exports.fetchJsonData = fetchJsonData;
exports.default = fetchWordpressData;
