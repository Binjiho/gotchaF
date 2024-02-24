import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createNoopStorage = () => {
    return {
        getItem(_key: any) {
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: any) {
            return Promise.resolve();
        },
    };
};

const storage =
    typeof window === 'undefined'
        ? createNoopStorage()
        : createWebStorage('local');

const rootPersistConfig = {
    key: 'root', // root에서부터 저장"
    storage, // storage = localStorage
    // blacklist: ['question'],
};
