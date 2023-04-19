import { defineStore } from 'pinia';
import { GM_getValue, GM_setValue } from '$';
import Aria2Client from '@/utils/Aria2Client';

export interface Aria2Settings {
    url: string;
    token?: string;
    timeout: number;
    dir?: string;
    readyState: number;
}

const DefaultAria2Settings = {
    url: Aria2Client.DEFAULT_ARIA2_URL,
    timeout: Aria2Client.DEFAULT_TIMEOUT,
    readyState: WebSocket.CLOSED
} as Aria2Settings;

export interface TestWindowSettings {
    show: boolean;
    top: number;
    left: number;
    width: string;
    height: string;
}

const DefaultTestWindowSettings = {
    show: false,
    top: 0,
    left: 0,
    width: "20%",
    height: "500px",
} as TestWindowSettings;

export interface SettingsState {
    aria2: Aria2Settings;
    testWindow: TestWindowSettings;
}

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => {
        return {
            aria2: {
                ...DefaultAria2Settings
            } as Aria2Settings,
            testWindow: {
                ...DefaultTestWindowSettings
            } as TestWindowSettings,
        };
    },

    actions: {
        loadAll() {
            let aria2 = GM_getValue<Aria2Settings>("aria2", {
                ...DefaultAria2Settings
            });
            this.aria2 = aria2;

            let testWindow = GM_getValue<TestWindowSettings>("testWindow", {
                ...DefaultTestWindowSettings
            });
            this.testWindow = testWindow;
        },

        updateAria2(input: Aria2Settings) {
            let changes: any = {};
            if (input.url != undefined) changes.url = input.url;
            if (input.token != undefined) changes.token = input.token;
            if (input.timeout != undefined) changes.timeout = input.timeout;
            if (input.dir != undefined) changes.dir = input.dir;
            console.info("aria2配置项改动如下：", changes);

            this.aria2 = { ...this.aria2, ...changes };
            GM_setValue("aria2", this.aria2);
        },

        updateTestWindow(testWindow: TestWindowSettings) {
            this.testWindow = { ...this.testWindow, ...testWindow };
            GM_setValue("testWindow", this.testWindow);
        }
    }
});
