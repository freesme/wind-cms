import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {createPostServiceClient} from "@/api/generated/app/service/v1";
import {requestClientRequestHandler} from "@/transport/rest";
import {
    contentservicev1_Post,
} from '@/api/generated/app/service/v1';

const postService = createPostServiceClient(requestClientRequestHandler);

export interface PostState {
    list: contentservicev1_Post[];
    detail: contentservicev1_Post | null;
    loading: boolean;
    total: number;
}

// 初始状态
const initialState: PostState = {
    list: [],
    detail: null,
    loading: false,
    total: 0,
};

// 获取文章列表
export const listPost = createAsyncThunk(
    'post/listPost',
    async (
        params: { page?: number; pageSize?: number; query?: string },
        {rejectWithValue}
    ) => {
        try {
            return await postService.List({
                query: params.query,
                page: params.page,
                pageSize: params.pageSize,
                sorting: undefined,
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// 获取单篇文章
export const getPost = createAsyncThunk(
    'post/getPost',
    async (
        params: { id: number },
        {rejectWithValue}
    ) => {
        try {
            return await postService.Get({id: params.id});
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// 创建文章
export const createPost = createAsyncThunk(
    'post/createPost',
    async (values: Partial<contentservicev1_Post>, {rejectWithValue}) => {
        try {
            return await postService.Create({data: values as contentservicev1_Post});
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// 更新文章
export const updatePost = createAsyncThunk(
    'post/updatePost',
    async (
        params: { id: number; values: Partial<contentservicev1_Post> },
        {rejectWithValue}
    ) => {
        try {
            return await postService.Update({
                id: params.id,
                data: params.values as contentservicev1_Post,
                updateMask: Object.keys(params.values ?? []).join(','),
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// 删除文章
export const deletePost = createAsyncThunk(
    'post/deletePost',
    async (id: number, {rejectWithValue}) => {
        try {
            return await postService.Delete({id});
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        // 清空文章详情
        clearPostDetail: (state) => {
            state.detail = null;
        },
        // 重置状态
        resetPost: (state) => {
            state.list = [];
            state.detail = null;
            state.loading = false;
            state.total = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(listPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(listPost.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.items || [];
                state.total = action.payload.total || 0;
            })
            .addCase(listPost.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.loading = false;
                state.detail = action.payload || null;
            })
            .addCase(getPost.rejected, (state) => {
                state.loading = false;
            })
            .addCase(createPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPost.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createPost.rejected, (state) => {
                state.loading = false;
            })
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePost.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updatePost.rejected, (state) => {
                state.loading = false;
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePost.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deletePost.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const {clearPostDetail, resetPost} = postSlice.actions;
export default postSlice.reducer;
