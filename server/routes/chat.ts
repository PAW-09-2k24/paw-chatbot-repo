import { Request, Response } from "express";
import TextLoader from "./textloader";

export const inMemoryChat = async (req: Request, res: Response) => {
  const question = req.query.question as string;
  const filePathOrUrl = "https://paw-09.vercel.app/to-do";

  const result = await TextLoader(question, filePathOrUrl);

  res.status(200).json({
    question,
    answer: result,
  });
};