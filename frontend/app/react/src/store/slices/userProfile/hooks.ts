import {useSelector, useDispatch} from 'react-redux';
import type {RootState, AppDispatch} from '@/store';
import {
    fetchUserProfile,
    clearUserProfile,
} from './slice';
import {createAbortableCalls} from "@/store/async-thunk";

export function useUserProfileStore() {
    const userProfile = useSelector((state: RootState) => state.userProfile);
    const dispatch = useDispatch<AppDispatch>();

    // 创建带取消功能的 API 调用
    const {
        fetchUserProfile: cancellableFetchUserProfile,
    } = createAbortableCalls(dispatch,
        {
            // @ts-expect-error - 忽略类型检查
            fetchUserProfile,
        });

    return {
        ...userProfile,
        fetchUserProfile: cancellableFetchUserProfile,
        clearUserProfile: () => dispatch(clearUserProfile()),
    };
}
