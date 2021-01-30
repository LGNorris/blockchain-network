"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_ENDPOINTS = void 0;
const status_1 = require("./status");
const blockchain_1 = require("./blockchain/blockchain");
const IRoute_1 = require("../interfaces/IRoute");
exports.API_ENDPOINTS = {
    STATUS: '/status',
    BLOCKCHAIN: '/blockchain'
};
const routes = [
    {
        method: IRoute_1.METHOD.GET,
        path: exports.API_ENDPOINTS.STATUS,
        cbs: [status_1.getStatus]
    },
    {
        method: IRoute_1.METHOD.GET,
        path: exports.API_ENDPOINTS.BLOCKCHAIN,
        cbs: [blockchain_1.getBlockchain]
    },
];
exports.default = routes;
