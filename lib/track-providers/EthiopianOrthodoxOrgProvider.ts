import { parse } from "node-html-parser"
import path from "path"
import { Track } from "../ITrack";
import { ITrackProviders } from "./ITrackProvider";

export class EthiopianOrthodoxOrgProvider extends ITrackProviders {
    BASE_URL = process.env.WEREB_URL

    async getTracks(): Promise<Track[]> {
        if (!this.BASE_URL) {
            throw new Error("WEREB_URL environment variable is not defined")
        }

        const response = await fetch(this.BASE_URL)
        const html = await response.text();
        const root = parse(html)

        const tracks = root
            .querySelectorAll("a")
            .filter((a) => a.getAttribute("href")?.toLowerCase().endsWith(".mp3"))
            .map(async (a) => {
                const href = a.getAttribute("href") || ""
                const url = new URL(href, this.BASE_URL).toString()
                const title = a.text.trim()
                const parsedPath = path.parse(href)
                const category = parsedPath.dir.replace("wereb keamet eske amet/", "")

                let duration = 0

                // try {
                //     const headResponse = await fetch(url, {
                //         method: 'HEAD',
                //         headers: {
                //             Range: 'bytes=0-0'
                //         }
                //     });

                //     const contentLength = headResponse.headers.get('content-range')?.split('/').pop() || '0';
                //     duration = (parseInt(contentLength || '0') * 8) / 140_000

                // } catch (error) {
                //     console.log(error)
                // }


                return {
                    id: Buffer.from(url).toString("base64"),
                    title,
                    url,
                    category,
                    duration,
                }
            })

        return Promise.all(tracks);

    }
}
