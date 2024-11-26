import "dotenv/config";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { DocumentInterface } from "@langchain/core/documents";
import fetch from "node-fetch"; // For fetching web data

export default async (question = "", filePathOrUrl = "") => {
  let content = "";

  if (filePathOrUrl.startsWith("http")) {
    // Fetch data from URL
    try {
      const response = await fetch(filePathOrUrl);
      if (!response.ok) {
        return `Failed to fetch from URL: ${response.statusText}`;
      }
      content = await response.text();
    } catch (error: any) { // Explicitly handle `error` type
      return `Error fetching data: ${error.message}`;
    }
  } else {
    // Handle file logic as before
    const fileExtension = filePathOrUrl.split(".").pop();
    let loader: any;

    if (fileExtension === "docx") {
      loader = new DocxLoader(filePathOrUrl);
    } else if (fileExtension === "txt") {
      loader = new TextLoader(filePathOrUrl);
    } else if (fileExtension === "pdf") {
      loader = new PDFLoader(filePathOrUrl, {
        splitPages: false,
      });
    } else {
      return "unsupported file type";
    }

    const docs = await loader.load();
    content = docs.map((doc: { pageContent: any; }) => doc.pageContent).join("\n");
  }

  // Continue processing the content
  const vectorStore = await MemoryVectorStore.fromDocuments(
    [new Document({ pageContent: content })],
    new OpenAIEmbeddings()
  );

  const searchResponse = await vectorStore.similaritySearch(question, 1);
  const textRes = searchResponse
    .map((item: DocumentInterface<Record<string, any>>) => item?.pageContent)
    .join("\n");

  const llm = new OpenAI({ modelName: "gpt-4" });
  const chain = loadQAStuffChain(llm);

  const result = await chain.invoke({
    input_documents: [new Document({ pageContent: `${textRes}` })],
    question,
  });

  console.log(`\n\n Question: ${question}`);
  console.log(`\n\n Answer: ${result.text}`);
  return result.text;
};