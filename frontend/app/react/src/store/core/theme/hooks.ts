import {useSelector, useDispatch} from 'react-redux';

import type {IThemeState, ThemeMode} from '../../types';
import type {AppDispatch, RootState} from '@/store';
import {appNamespace, StorageManager} from "@/caches";

import {setMode} from './slice';


export function useThemeStore() {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector<RootState, IThemeState>((state) => state.theme);
    const storage = new StorageManager({prefix: `${appNamespace}-theme`});

    return {
        theme,
        dispatch,
        setMode: (mode: ThemeMode) => {
            dispatch(setMode(mode));
            // storage.setItem 已经在 slice 中处理
        },
    };
}

/**
 * 获取当前主题模式
 */
export function useThemeMode() {
    // 始终使用 Redux store 中的值，确保响应式更新
    return useSelector<RootState, ThemeMode>((state) => state.theme.mode);
}
