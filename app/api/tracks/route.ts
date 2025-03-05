import { NextResponse } from "next/server"
import { TrackProvidersFactory } from "@/lib/track-providers/TrackProvidersFactory"


export async function GET() {
  try {

    const provider = TrackProvidersFactory.getProvider("eotc-org");
    if (!provider) {
      return NextResponse.json({ error: "Failed to get provider" }, { status: 500 })
    }

    const tracks = await provider.getTracks()
    return NextResponse.json(tracks)

  } catch (error) {
    console.error("Error fetching tracks:", error)
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 })
  }
}

