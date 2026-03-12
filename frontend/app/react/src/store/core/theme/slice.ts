import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {IThemeState, ThemeMode} from '../../types';
import {StorageManager} from '@/caches';
import {appNamespace} from '@/caches';

const storage = new StorageManager({prefix: `${appNamespace}-theme`});

// 从 localStorage 读取初始值
const storedMode = storage.getItem<ThemeMode>('mode', null);

const initialState: IThemeState = {
    mode: storedMode || 'system',  // 如果有存储的偏好则使用，否则跟随系统
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setMode(state, action: PayloadAction<ThemeMode>) {
            state.mode = action.payload;
            // 持久化到 localStorage
            storage.setItem('mode', action.payload);
        },
    }
});

export const {setMode} = themeSlice.actions;

export default themeSlice.reducer;
