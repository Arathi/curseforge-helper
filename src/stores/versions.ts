import { defineStore } from 'pinia';

export interface GameVersionTypeInfo {
    id: number;
    name: string;
    versions: string[];
}

export const useVersionStore = defineStore('versions', {
    state: () => {
        return {
            typeInfos: [] as GameVersionTypeInfo[]
        }
    },

    getters: {
        typeInfos: (state) => {
            return state.typeInfos;
        }
    },

    actions: {
        addTypeInfo(typeInfo: GameVersionTypeInfo) {
            this.typeInfos.push(typeInfo);
        }
    }
});
