"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = void 0;
const getStatus = (req, res) => {
    res.json({
        message: 'Blockchain network node is running'
    });
};
exports.getStatus = getStatus;
