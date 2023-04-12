export interface GameVersionType {
    id: number;
    gameId: number;
    name: string;
    slug: string;
}

export interface GameVersionsByType {
    type: number;
    versions: string[];
}

export interface GameVersion {
    id: number;
    slug: string;
    name: string;
}

export interface GameVersionsByTypeV2 {
    type: number;
    versions: GameVersion[];
}