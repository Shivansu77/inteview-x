import type { Request, Response } from "express";
import { Interview } from "../models/interview.model";

export const saveInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { role, experience, topic, review, questionHistory } = req.body;

    if (!role || !experience || !topic || !review) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const interview = await Interview.create({
      user_id: userId,
      role,
      experience,
      topic,
      review,
      questionHistory: questionHistory || [],
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error: any) {
    console.error("saveInterview Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getUserInterviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const interviews = await Interview.findByUserId(userId);
    res.json({ success: true, data: interviews });
  } catch (error: any) {
    console.error("getUserInterviews Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const deleteInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const id = req.params.id as string;
    const deleted = await Interview.deleteById(id, userId);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Interview not found or unauthorized" });
      return;
    }

    res.json({ success: true, message: "Interview deleted" });
  } catch (error: any) {
    console.error("deleteInterview Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const clearUserInterviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    await Interview.deleteByUserId(userId);
    res.json({ success: true, message: "All interviews cleared" });
  } catch (error: any) {
    console.error("clearUserInterviews Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
