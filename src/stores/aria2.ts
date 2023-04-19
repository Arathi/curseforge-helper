import { defineStore } from 'pinia';

enum Aria2Status {
    Disconnected = 0,
    Connecting,
    Connected
}

interface Aria2State {
    status: Aria2Status
}

export const useAria2Store = defineStore("aria2", {
    state: (): Aria2State => {
        return {
            status: Aria2Status.Disconnected
        };
    }
});