"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_1 = require("./chat");
const nocache_1 = __importDefault(require("nocache"));
const router = (0, express_1.Router)();
router.get("/v1/in-memory-ai-text", (0, nocache_1.default)(), chat_1.inMemoryChat);
exports.default = router;
