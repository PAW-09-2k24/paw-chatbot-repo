"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errors_1 = require("./middlewares/errors");
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)());
app.use(routes_1.default);
app.use(errors_1.errorHandler);
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
