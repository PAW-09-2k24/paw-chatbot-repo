"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemoryChat = void 0;
const textloader_1 = __importDefault(require("./textloader"));
const inMemoryChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const question = req.query.question;
    const filePathOrUrl = "https://paw-09.vercel.app/to-do";
    const result = yield (0, textloader_1.default)(question, filePathOrUrl);
    res.status(200).json({
        question,
        answer: result,
    });
});
exports.inMemoryChat = inMemoryChat;
