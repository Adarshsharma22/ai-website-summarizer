import axios from "axios";
import * as cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const FETCH_TIMEOUT_MS = 10000;
const MAX_CONTENT_CHARS = 8000; 

export class ScraperError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "ScraperError";
    this.statusCode = statusCode;
  }
}

// Validates that a URL string is well-formed and uses http/https only.

export function validateUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new ScraperError("Please enter a valid URL.", 400);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new ScraperError(
      "Only http:// and https:// URLs are supported.",
      400
    );
  }

  return parsed.toString();
}

export async function fetchAndExtract(rawUrl) {
  const url = validateUrl(rawUrl);

  let response;
  try {
    response = await axios.get(url, {
      timeout: FETCH_TIMEOUT_MS,
      maxRedirects: 5,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      // Only treat success
      validateStatus: (status) => status >= 200 && status < 300,
    });
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      throw new ScraperError(
        "The request to that website timed out. Please try again or use a different URL.",
        408
      );
    }
    if (err.response) {
      const status = err.response.status;
      if (status === 404) {
        throw new ScraperError("That page could not be found (404).", 404);
      }
      if (status === 403 || status === 401) {
        throw new ScraperError(
          "That website blocked our request to access it.",
          403
        );
      }
      throw new ScraperError(
        "We couldn't access this webpage. Please make sure the URL is publicly accessible.",
        502
      );
    }
    throw new ScraperError(
      "We couldn't access this webpage. Please make sure the URL is publicly accessible.",
      502
    );
  }

  const contentType = response.headers["content-type"] || "";
  if (!contentType.includes("text/html")) {
    throw new ScraperError(
      "That URL does not point to a readable HTML webpage.",
      422
    );
  }

  const $ = cheerio.load(response.data);

  // Strip elements that don't contribute 
  $("script, style, noscript, nav, footer, header, iframe, svg, form").remove();

  const title = $("title").first().text().trim() || url;

  const bodyText = $("body").text();
  const cleanedText = bodyText.replace(/\s+/g, " ").trim();

  if (!cleanedText || cleanedText.length < 50) {
    throw new ScraperError(
      "Thi URL cant be summarized because it doesn't contain any readable content.",
      422
    );
  }

  const limitedText = cleanedText.slice(0, MAX_CONTENT_CHARS);

  return { title, content: limitedText, url };
}
