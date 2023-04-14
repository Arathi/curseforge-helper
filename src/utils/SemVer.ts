export default class SemVer {
    static readonly regex: RegExp = /^(0|[1-9]\d*)(\.(0|[1-9]\d*))?(\.(0|[1-9]\d*))?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

    major?: number;
    minor?: number;
    patch?: number;

    preRelease?: string;
    build?: string;

    constructor(version: string) {
        this.parse(version);
    }

    majorValue() : number {
        return this.major != undefined ? this.major : 0;
    }

    minorValue() : number {
        return this.minor != undefined ? this.minor : 0;
    }

    patchValue() : number {
        return this.patch != undefined ? this.patch : 0;
    }

    preReleaseValue() : string {
        return this.preRelease != undefined ? this.preRelease : '';
    }

    buildValue() : string {
        return this.build != undefined ? this.build : '';
    }

    parse(version: string) {
        let matcher = SemVer.regex.exec(version);
        if (matcher != null) {
            if (matcher[1] != undefined) {
                this.major = parseInt(matcher[1]);
            }
            if (matcher[3] != undefined) {
                this.minor = parseInt(matcher[3]);
            }
            if (matcher[5] != undefined) {
                this.patch = parseInt(matcher[5]);
            }
            if (matcher[6] != undefined) {
                this.preRelease = matcher[6];
            }
            if (matcher[7] != undefined) {
                this.build = matcher[7];
            }
        }
    }

    toString() {
        let version = '';
        if (this.major != undefined) {
            version += `${this.major}`;
        }
        if (this.minor != undefined) {
            version += `.${this.minor}`;
        }
        if (this.patch != undefined) {
            version += `.${this.patch}`;
        }
        if (this.preRelease != undefined) {
            version += `-${this.preRelease}`;
        }
        if (this.build != undefined) {
            version += `+${this.build}`;
        }
        return version;
    }

    valid() {
        return this.major != undefined;
    }

    compare(version: SemVer) {
        let delta = this.majorValue() - version.majorValue();
        if (delta != 0) return delta;

        delta = this.minorValue() - version.minorValue();
        if (delta != 0) return delta;

        delta = this.patchValue() - version.patchValue();
        if (delta != 0) return delta;

        if (this.preRelease == undefined && version.preRelease != undefined) {
            return 1;
        }
        if (this.preRelease != undefined && version.preRelease == undefined) {
            return -1;
        }
        if (this.preReleaseValue() > version.preReleaseValue()) {
            return 1;
        }
        if (this.preReleaseValue() < version.preReleaseValue()) {
            return -1;
        }

        if (this.buildValue() > version.buildValue()) {
            return 1;
        }
        if (this.buildValue() < version.buildValue()) {
            return -1;
        }

        return 0;
    }
}