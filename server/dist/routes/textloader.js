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
require("dotenv/config");
const memory_1 = require("langchain/vectorstores/memory");
const openai_1 = require("@langchain/openai");
const chains_1 = require("langchain/chains");
const text_1 = require("langchain/document_loaders/fs/text");
const docx_1 = require("langchain/document_loaders/fs/docx");
const pdf_1 = require("langchain/document_loaders/fs/pdf");
const documents_1 = require("@langchain/core/documents");
const node_fetch_1 = __importDefault(require("node-fetch")); // For fetching web data
exports.default = (question = "", filePathOrUrl = "") => __awaiter(void 0, void 0, void 0, function* () {
    let content = "";
    if (filePathOrUrl.startsWith("http")) {
        // Fetch data from URL
        try {
            const response = yield (0, node_fetch_1.default)(filePathOrUrl);
            if (!response.ok) {
                return `Failed to fetch from URL: ${response.statusText}`;
            }
            content = yield response.text();
        }
        catch (error) { // Explicitly handle `error` type
            return `Error fetching data: ${error.message}`;
        }
    }
    else {
        // Handle file logic as before
        const fileExtension = filePathOrUrl.split(".").pop();
        let loader;
        if (fileExtension === "docx") {
            loader = new docx_1.DocxLoader(filePathOrUrl);
        }
        else if (fileExtension === "txt") {
            loader = new text_1.TextLoader(filePathOrUrl);
        }
        else if (fileExtension === "pdf") {
            loader = new pdf_1.PDFLoader(filePathOrUrl, {
                splitPages: false,
            });
        }
        else {
            return "unsupported file type";
        }
        const docs = yield loader.load();
        content = docs.map((doc) => doc.pageContent).join("\n");
    }
    // Continue processing the content
    const vectorStore = yield memory_1.MemoryVectorStore.fromDocuments([new documents_1.Document({ pageContent: content })], new openai_1.OpenAIEmbeddings());
    const searchResponse = yield vectorStore.similaritySearch(question, 1);
    const textRes = searchResponse
        .map((item) => item === null || item === void 0 ? void 0 : item.pageContent)
        .join("\n");
    const llm = new openai_1.OpenAI({ modelName: "gpt-4" });
    const chain = (0, chains_1.loadQAStuffChain)(llm);
    const result = yield chain.invoke({
        input_documents: [new documents_1.Document({ pageContent: `${textRes}` })],
        question,
    });
    console.log(`\n\n Question: ${question}`);
    console.log(`\n\n Answer: ${result.text}`);
    return result.text;
});
