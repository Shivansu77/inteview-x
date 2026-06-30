import type { Request, Response } from "express";
import { Profile } from "../models/profile.model";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const profile = await Profile.findByUserId(userId);
    res.json({ success: true, data: profile || {} });
  } catch (error: any) {
    console.error("getProfile Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { headline, targetRole, githubUrl, linkedinUrl, resumeFileName } = req.body;

    const profile = await Profile.upsert(userId, {
      headline: headline || "",
      targetRole: targetRole || "",
      githubUrl: githubUrl || "",
      linkedinUrl: linkedinUrl || "",
      resumeFileName: resumeFileName || "",
    });

    res.json({ success: true, data: profile });
  } catch (error: any) {
    console.error("updateProfile Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
