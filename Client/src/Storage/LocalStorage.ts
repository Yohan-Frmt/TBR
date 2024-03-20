import { MemoryStorage } from "./MemoryStorage";

const Errors: string[] = [
    'NS_ERROR_FAILURE',
    'NS_ERROR_FILE_CORRUPTED',
    'NS_ERROR_FILE_NO_DEVICE_SPACE',
]

export class LocalStorage {
    readonly localStorage!: MemoryStorage
    readonly sessionStorage!: MemoryStorage
    private corruptedAlertWasShowed: boolean = false

    constructor() {
        if (!LocalStorage.isSupported(() => window.localStorage)) {
            this.localStorage = new MemoryStorage()
        }

        if (!LocalStorage.isSupported(() => window.sessionStorage)) {
            this.sessionStorage = new MemoryStorage()
        }
    }

    private static isSupported = (getStorage: () => Storage): boolean => {
        try {
            const testKey = 'random_key';
            getStorage().setItem(testKey, testKey);
            getStorage().removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    };

    private getLocalStorage = (): Storage => this.localStorage || localStorage;

    private getSessionStorage = (): Storage => this.sessionStorage || sessionStorage;

    private get = <T = any>(name: string, storage: Storage): T | null => {
        try {
            return JSON.parse(storage.getItem(name)!);
        } catch (err: any) {
            if (Errors.includes(err.name)) {
                this.clear(storage)
                return null;
            }
            console.warn(err, {
                extra: {
                    name,
                },
            });
            this.remove(name, storage);
            return null;
        }
    };

    private set = <T = any>(name: string, value: T, storage: Storage): void => {
        try {
            storage.setItem(name, JSON.stringify(value));
        } catch (err: any) {
            console.warn(err, {
                extra: {
                    name,
                    value,
                },
            });

            if (Errors.includes(err.name)) {
                this.clear(storage);
            }
        }
    };

    private remove = (name: string, storage: Storage): void => {
        try {
            storage.removeItem(name);
        } catch (err: any) {
            console.warn(err, {
                extra: {
                    name,
                },
            });
        }
    };


    private clear = (storage: Storage): void => {
        try {
            console.info('clean up storage');
            storage.clear();
        } catch (err: any) {
            if (Errors.includes(err.name) && !this.corruptedAlertWasShowed) {
                alert('Sorry, it looks like your browser storage has been corrupted. '
                    + 'Please clear your storage by going to Tools -> Clear Recent History -> Cookies and set time range to \'Everything\'. '
                    + 'This will remove the corrupted browser storage across all sites.'
                );
                this.corruptedAlertWasShowed = true;
            }
            console.info(err);
        }
    };

    private keys = (storage: Storage): (string | null)[] => {
        const length = storage.length;
        const result = [];
        for (let i = 0; i < length; i++) {
            result.push(storage.key(i));
        }
        return result;
    };

    public getItem = <T = any>(name: string): T | null => this.get<T>(name, this.getLocalStorage());

    public setItem = <T = any>(name: string, value: T): void => {
        this.set<T>(name, value, this.getLocalStorage())
    };

    public updateItem = <T = any>(name: string, fn: (item: T) => T): void => {
        const item = this.getItem(name)
        this.set<T>(name, fn(item), this.getLocalStorage())
    };

    public removeItem = (name: string): void => {
        this.remove(name, this.getLocalStorage())
    };

    public getKeys = (): (string | null)[] => this.keys(this.getLocalStorage());

    public getSessionItem = <T = any>(name: string): T | null => this.get(name, this.getSessionStorage());

    public setSessionItem = <T = any>(name: string, value: T): void => {
        this.set(name, value, this.getSessionStorage())
    };

    public updateSessionItem = <T = any>(name: string, fn: (item: T) => T): void => {
        const item = this.getSessionItem(name)
        this.set<T>(name, fn(item), this.getSessionStorage())
    };

    public removeSessionItem = (name: string): void => {
        this.remove(name, this.getSessionStorage())
    };

    public getSessionKeys = (): (string | null)[] => this.keys(this.getSessionStorage());
}
