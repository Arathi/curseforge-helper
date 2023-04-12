import axios, { AxiosInstance } from 'axios';

import Category from './Category';
import Mod from './Mod';
import {
    GameVersionType,
    GameVersionsByType
} from './GameVersionType';

interface GetCategoriesParams {
    gameId: number,
    classId?: number,
    classesOnly?: boolean
}

interface SearchModsParams {
    gameId: number;
    classId?: number;
    categoryId?: number;
    gameVersion?: string;
    searchFilter?: string;
    sortField?: number;
    sortOrder?: string;
    modLoaderType?: number;
    gameVersionTypeId?: number;
    authorId?: number;
    slug?: string;
    index?: number;
    pageSize?: number;
}

export enum ModsSearchSortField {
    Featured = 1,
    Popularity,
    LastUpdated,
    Name,
    Author,
    TotalDownloads,
    Category,
    GameVersion
}

export type SortOrder = [
    "asc", 
    "desc"
];

export enum ModLoaderType {
    Any,
    Forge,
    Cauldron,
    LiteLoader,
    Fabric,
    Quilt
}

export interface SearchModsConditions {
    categoryId?: number;
    gameVersion?: string;
    searchFilter?: string;
    sortField?: ModsSearchSortField;
    sortOrder?: SortOrder;
    modLoaderType?: number;
    gameVersionTypeId?: number;
    authorId?: number;
    slug?: string;
}

export default class CurseForgeApi {
    static readonly BaseUrl: string = "https://api.curseforge.com";

    static readonly GameIdMinecraft: number = 432;
    static readonly ClassIdMods: number = 6;

    apiKey: string;
    httpClient: AxiosInstance;

    constructor(apiKey: string = "", baseUrl: string = CurseForgeApi.BaseUrl) {
        console.info("正在创建CurseForgeApi，参数如下：");
        console.info(`Base URL: ${baseUrl}`);
        console.info(`API_KEY: ${apiKey}`);

        this.apiKey = apiKey;
        this.httpClient = axios.create({
            baseURL: baseUrl,
            headers: {
                'x-api-key': apiKey
            },
            withCredentials: true
        });
    }

    reset(apiKey: string = "", baseUrl: string = CurseForgeApi.BaseUrl) {
        console.info("正在重置CurseForgeApi，参数如下：");
        console.info(`Base URL: ${baseUrl}`);
        console.info(`API_KEY: ${apiKey}`);

        this.apiKey = apiKey;
        this.httpClient = axios.create({
            baseURL: baseUrl,
            headers: {
                'x-api-key': apiKey
            },
            withCredentials: true
        });
    }

    getCategories(classId?: number, classesOnly?: boolean) : Promise<Category[]> {
        let empty: Category[] = [];

        let uri = "/v1/categories";
        let params: GetCategoriesParams = {
            gameId: CurseForgeApi.GameIdMinecraft,
            classId: classId,
            classesOnly: classesOnly
        } as GetCategoriesParams;

        return this.httpClient.get(uri, {
            params: params
        }).then((resp) => {
            if (resp.status == 200) {
                try {
                    let respMsg = resp.data;
                    let data = respMsg.data as Category[];
                    // TODO 
                    return data;
                }
                catch (ex) {
                    console.warn(`${uri} 响应报文转换失败：`, ex);
                }
            }
            return empty;
        });
    }

    getGameVersionTypes() : Promise<GameVersionType[]> {
        let empty: GameVersionType[] = [];

        let uri = `/v1/games/${CurseForgeApi.GameIdMinecraft}/version-types`
        return this.httpClient.get(uri).then((resp) => {
            if (resp.status == 200) {
                try {
                    let respMsg = resp.data;
                    let data = respMsg.data as GameVersionType[];
                    return data;
                }
                catch (ex) {
                    console.warn(`${uri} 响应报文转换失败：`, ex);
                }
            }
            return empty;
        });
    }

    getGameVersions() : Promise<GameVersionsByType[]> {
        let empty: GameVersionsByType[] = [];

        let uri = `/v1/games/${CurseForgeApi.GameIdMinecraft}/versions`
        return this.httpClient.get(uri).then((resp) => {
            if (resp.status == 200) {
                try {
                    let respMsg = resp.data;
                    let data = respMsg.data as GameVersionsByType[];
                    return data;
                }
                catch (ex) {
                    console.warn(`${uri} 响应报文转换失败：`, ex);
                }
            }
            return empty;
        });
    }

    searchMods(conditions: SearchModsConditions, pageIndex: number = 0, pageSize: number = 50) : Promise<Mod[]> {
        let empty: Mod[] = [];

        let requireParams = {
            gameId: CurseForgeApi.GameIdMinecraft,
            classId: CurseForgeApi.ClassIdMods,
            index: pageIndex,
            pageSize: pageSize
        } as SearchModsParams;

        let uri = "/v1/mods/search";
        let params: any = {
            ...requireParams,
            ...conditions
        };

        return this.httpClient.get(uri, {
            params: params
        }).then((resp) => {
            if (resp.status == 200) {
                try {
                    let respMsg = resp.data;
                    let data = respMsg.data as Mod[];
                    // TODO 
                    return data;
                }
                catch (ex) {
                    console.warn(`${uri} 响应报文转换失败：`, ex);
                }
            }
            return empty;
        });
    }
}