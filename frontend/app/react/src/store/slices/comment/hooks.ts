import {useSelector, useDispatch} from 'react-redux';
import type {RootState, AppDispatch} from '@/store';
import {
    listComment,
    getComment,
    createComment,
    updateComment,
    deleteComment,
    clearCommentDetail,
    resetComment,
} from './slice';
import {createAbortableCalls} from "@/store/async-thunk";

export function useCommentStore() {
    const comment = useSelector((state: RootState) => state.comment);
    const dispatch = useDispatch<AppDispatch>();

    // 创建带取消功能的 API 调用
    const {
        listComment: cancellableListComment,
        getComment: cancellableGetComment,
        createComment: cancellableCreateComment,
        updateComment: cancellableUpdateComment,
        deleteComment: cancellableDeleteComment,
    } = createAbortableCalls(dispatch,
        {
            // @ts-expect-error - 忽略类型检查
            listComment,
            // @ts-expect-error - 忽略类型检查
            getComment,
            // @ts-expect-error - 忽略类型检查
            createComment,
            // @ts-expect-error - 忽略类型检查
            updateComment,
            // @ts-expect-error - 忽略类型检查
            deleteComment,
        });

    return {
        ...comment,
        listComment: cancellableListComment,
        getComment: cancellableGetComment,
        createComment: cancellableCreateComment,
        updateComment: cancellableUpdateComment,
        deleteComment: cancellableDeleteComment,
        clearCommentDetail: () => dispatch(clearCommentDetail()),
        resetComment: () => dispatch(resetComment()),
    };
}
