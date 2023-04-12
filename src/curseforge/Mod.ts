import Category from "./Category";

interface ModLinks {
    websiteUrl: string;
    wikiUrl: string;
    issuesUrl: string;
    sourceUrl: string;
}

interface ModAuthor {
    id: number;
    name: string;
    url: string;
}

interface ModAsset {
    id: number;
    modId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    url: string;
}

interface File {
    id: number;
    gameId: number;
    modId: number;
    isAvailable: boolean;
    displayName: string;
    fileName: string;
    releaseType: number;
    fileStatus: number;
    hashes: FileHash[];
    fileDate: string;
    fileLength: number;
    downloadCount: number;
    downloadUrl: string;
    gameVersions: string[];
    sortableGameVersions: SortableGameVersion[];
    dependencies: FileDependency[];
    exposeAsAlternative?: boolean;
    parentProjectFileId?: number;
    alternateFileId?: number;
    isServerPack?: boolean;
    serverPackFileId?: number;
    isEarlyAccessContent?: boolean;
    earlyAccessEndDate?: string;
    fileFingerprint: number;
    modules: FileModule[];
}

interface FileHash {
    value: string;
    algo: number;
}

interface SortableGameVersion {
    gameVersionName: string;
    gameVersionPadded: string;
    gameVersion: string;
    gameVersionReleaseDate: string;
    gameVersionTypeId?: number;
}

interface FileDependency {
    modId: number;
    relationType: number;
}

interface FileModule {
    name: string;
    fingerprint: number;
}

interface FileIndex {
    gameVersion: string;
    fileId: number;
    filename: string;
    releaseType: number;
    gameVersionTypeId?: number;
    modLoader: number;
}

export default interface Mod {
    id: number;
    gameId: number;
    name: string;
    slug: string;
    links: ModLinks;
    summary: string;
    status: number;
    downloadCount: number;
    isFeatured: boolean;
    primaryCategoryId: number;
    categories: Category[];
    classId?: number;
    authors: ModAuthor[];
    logo: ModAsset;
    screenshots: ModAsset[];
    mainFileId: number;
    latestFiles: File[];
    latestFilesIndexes: FileIndex[];
    dateCreated: string;
    dateModified: string;
    dateReleased: string;
    allowModDistribution?: boolean;
    gamePopularityRank: number;
    isAvailable: boolean;
    thumbsUpCount: number;
}
