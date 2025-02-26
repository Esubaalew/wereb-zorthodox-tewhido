import { NextResponse } from "next/server"
import { parse } from "node-html-parser"
import path from "path"

const BASE_URL = process.env.WEREB_URL

export async function GET() {
  try {
    if (!BASE_URL) {
      throw new Error("WEREB_URL environment variable is not defined")
    }
    const response = await fetch(BASE_URL)
    const html = await response.text()
    const root = parse(html)

    const tracks = root
      .querySelectorAll("a")
      .filter((a) => a.getAttribute("href")?.toLowerCase().endsWith(".mp3"))
      .map((a) => {
        const href = a.getAttribute("href") || ""
        const url = new URL(href, BASE_URL).toString()
        const title = a.text.trim()
        const parsedPath = path.parse(href)
        const category = parsedPath.dir.replace("wereb keamet eske amet/", "")

        // Generate a random duration between 2 and 10 minutes
        const duration = Math.floor(Math.random() * (600 - 120 + 1) + 120)

        return {
          id: Buffer.from(url).toString("base64"),
          title,
          url,
          category,
          duration,
        }
      })

    return NextResponse.json(tracks)
  } catch (error) {
    console.error("Error fetching tracks:", error)
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 })
  }
}

