import { defineStore } from 'pinia';

import Mod from '@/curseforge/Mod';

export const useModStore = defineStore('mods', {
    state: () => {
        return {
            results: [] as Mod[]
        };
    },

    getters: {
        getResults: (state) => {
            return state.results;
        }
    },

    actions: {
        addResult(mod: Mod) {
            this.results.push(mod);
        },

        addResults(mods: Mod[]) {
            this.results.push(...mods);
        }
    }
});
