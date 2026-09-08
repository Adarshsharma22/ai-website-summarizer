import prisma from "../lib/prisma.js";
import { fetchAndExtract, ScraperError } from "../services/scraper.js";
import { generateSummary, AiServiceError } from "../services/ai.js";

export async function createSummary(req, res, next) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "Please enter a valid URL." });
    }

    let extracted;
    try {
      extracted = await fetchAndExtract(url);
    } catch (err) {
      if (err instanceof ScraperError) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      throw err;
    }

    let summaryText;
    try {
      summaryText = await generateSummary(extracted);
    } catch (err) {
      if (err instanceof AiServiceError) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      throw err;
    }

    const saved = await prisma.summary.create({
      data: {
        url: extracted.url,
        title: extracted.title,
        summary: summaryText,
        userId: req.user.id,
      },
    });

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}

export async function getSummaries(req, res, next) {
  try {
    const summaries = await prisma.summary.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(summaries);
  } catch (err) {
    next(err);
  }
}

export async function deleteSummary(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid summary id." });
    }

    const summary = await prisma.summary.findUnique({ where: { id } });

    if (!summary || summary.userId !== req.user.id) {
      return res.status(404).json({ message: "Summary not found." });
    }

    await prisma.summary.delete({ where: { id } });
    res.status(200).json({ message: "Summary deleted." });
  } catch (err) {
    next(err);
  }
}
