import { Track } from "../ITrack";

export abstract class ITrackProviders {
    abstract getTracks(): Promise<Track[]>;
}