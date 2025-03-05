import { EthiopianOrthodoxOrgProvider } from "./EthiopianOrthodoxOrgProvider";
import { ITrackProviders } from "./ITrackProvider";

class TrackProvidersFactory {
    static getProvider(provider: string): ITrackProviders {
        switch (provider) {
            case 'eotc-org':
                return new EthiopianOrthodoxOrgProvider();
            default:
                throw new Error('Unknown provider');
        }
    }
}

export { TrackProvidersFactory };