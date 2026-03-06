<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useMessage} from 'naive-ui'
import {$t} from '@/locales'
import {useCommentStore} from '@/stores/modules/app'
import {ContentViewer} from '@/components/ContentViewer'
import type {
  commentservicev1_Comment,
  commentservicev1_Comment_ContentType
} from "@/api/generated/app/service/v1"

// --- 类型定义 ---
interface CommentForm {
  content: string
  authorName: string
  email: string
}

// --- Props ---
const props = defineProps<{
  objectId: number | null
  contentType: commentservicev1_Comment_ContentType | null
}>()

// --- Emits ---
const emit = defineEmits<{
  (e: 'update:comments', comments: commentservicev1_Comment[]): void
}>()

// --- Store ---
const commentStore = useCommentStore()

// --- 状态 ---
const message = useMessage()
const submitting = ref(false)
const loading = ref(false)
const comments = ref<commentservicev1_Comment[]>([])

const newComment = ref<CommentForm>({
  content: '',
  authorName: '',
  email: '',
})

// --- 计算属性 ---
const displayComments = computed(() => comments.value || [])

const hasComments = computed(() => displayComments.value.length > 0)

// --- 方法 ---
function formatDate(dateString: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString()
}

async function loadComments() {
  console.log('Load comments...')

  if (!props.objectId || !props.contentType) return
  if (loading.value) return

  loading.value = true
  try {
    const res = await commentStore.listComment(
      {
        page: 1,
        pageSize: 50
      },
      {
        objectId: props.objectId,
        contentType: props.contentType,
        status: 'STATUS_APPROVED'
      }
    )
    comments.value = res.items || []
    emit('update:comments', comments.value)
  } catch (error) {
    console.error('Load comments failed:', error)
  } finally {
    loading.value = false
  }
}

async function handleSubmitComment() {
  if (!newComment.value.content || !newComment.value.authorName || !newComment.value.email) {
    message.warning($t('page.post_detail.fill_form_info'))
    return
  }
  if (!props.objectId || submitting.value) return

  submitting.value = true
  try {
    await commentStore.createComment({
      postId: props.objectId,
      content: newComment.value.content,
      authorName: newComment.value.authorName,
      email: newComment.value.email,
      status: 'COMMENT_STATUS_PENDING',
    })
    message.success($t('page.post_detail.comment_submitted'))
    newComment.value = {content: '', authorName: '', email: ''}
    await loadComments()
    // 用户体验优化：提交后滚动到评论列表
    setTimeout(() => {
      document.querySelector('.comments-list')?.scrollIntoView({behavior: 'smooth'})
    }, 100)
  } catch (error) {
    console.error('Submit comment failed:', error)
    message.error($t('page.post_detail.submit_comment_failed'))
  } finally {
    submitting.value = false
  }
}

// --- 生命周期 ---
onMounted(() => {
  loadComments()
})
</script>

<template>
  <section class="comments-section">
    <div class="section-header">
      <h2>
        <span class="i-carbon:chat"/>
        {{ $t('page.post_detail.comments_count', {count: displayComments.length}) }}
      </h2>
    </div>

    <!-- Comment Form -->
    <div class="comment-form">
      <h3>{{ $t('page.post_detail.write_comment') }}</h3>
      <n-form>
        <n-grid :cols="2" :x-gap="16">
          <n-form-item-gi :label="$t('page.post_detail.nickname')">
            <n-input
              v-model:value="newComment.authorName"
              :placeholder="$t('page.post_detail.enter_nickname')"
              size="large"
              :disabled="submitting"
            />
          </n-form-item-gi>
          <n-form-item-gi :label="$t('page.post_detail.email')">
            <n-input
              v-model:value="newComment.email"
              :placeholder="$t('page.post_detail.enter_email')"
              type="text"
              size="large"
              :disabled="submitting"
            />
          </n-form-item-gi>
        </n-grid>
        <n-form-item :label="$t('page.post_detail.comment_content')">
          <n-input
            v-model:value="newComment.content"
            type="textarea"
            :rows="5"
            :placeholder="$t('page.post_detail.write_comment')"
            size="large"
            :disabled="submitting"
          />
        </n-form-item>
        <n-form-item>
          <n-button
            type="primary"
            size="large"
            @click="handleSubmitComment"
            :loading="submitting"
          >
            <template #icon>
              <span class="i-carbon:send-alt"/>
            </template>
            {{ $t('page.post_detail.submit_comment') }}
          </n-button>
        </n-form-item>
      </n-form>
    </div>

    <!-- Comments List -->
    <div v-if="hasComments" class="comments-list">
      <div v-for="comment in displayComments" :key="comment.id" class="comment-item">
        <div class="comment-avatar">
          <n-avatar :size="48" round>
            {{ comment.authorName?.charAt(0) || 'U' }}
          </n-avatar>
        </div>
        <div class="comment-body">
          <div class="comment-header">
            <strong class="comment-author">{{ comment.authorName }}</strong>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div class="comment-content">
            <ContentViewer :content="comment.content" type="text"/>
          </div>
        </div>
      </div>
    </div>
    <n-empty v-else :description="$t('page.post_detail.no_comments')"
             style="margin-top: 40px;"/>
  </section>
</template>

<style scoped lang="less">
// Section Header
.section-header {
  margin-bottom: 32px;

  h2 {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: var(--color-text-primary);

    span[class^="i-"] {
      font-size: 32px;
      color: var(--color-brand);
    }
  }
}

// Comments Section
.comments-section {
  max-width: 1200px;
  margin: 0 auto 40px;
  background: var(--color-surface);
  border-radius: 16px;
  padding: 48px 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

// Comment Form
.comment-form {
  background: var(--color-bg);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 40px;
  border: 1px solid var(--color-border);

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 24px 0;
    color: var(--color-text-primary);
  }

  :deep(.n-form-item) {
    margin-bottom: 24px;
  }

  :deep(.n-button) {
    padding: 0 32px;
  }
}

// Comments List
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: var(--color-bg);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: all 0.3s;

  &:hover {
    border-color: var(--color-brand);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  .comment-avatar {
    flex-shrink: 0;

    :deep(.n-avatar) {
      background: linear-gradient(135deg, var(--color-brand) 0%, #764ba2 100%);
      color: #fff;
      font-weight: 600;
    }
  }

  .comment-body {
    flex: 1;
    min-width: 0;

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .comment-author {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .comment-date {
        font-size: 14px;
        color: var(--color-text-secondary);
      }
    }

    .comment-content {
      font-size: 15px;
      line-height: 1.7;
      color: var(--color-text-primary);
    }
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .comments-section {
    padding: 40px 48px;
  }
}

@media (max-width: 768px) {
  .comments-section {
    padding: 36px 32px;
  }

  .section-header {
    margin-bottom: 28px;

    h2 {
      font-size: 24px;

      span[class^="i-"] {
        font-size: 28px;
      }
    }
  }

  .comment-form {
    padding: 24px;
    margin-bottom: 32px;

    h3 {
      font-size: 18px;
      margin-bottom: 20px;
    }

    :deep(.n-form-item) {
      margin-bottom: 20px;
    }

    :deep(.n-grid) {
      gap: 12px !important;
    }

    :deep(.n-button) {
      padding: 0 28px;
      height: 44px;
    }
  }

  .comment-item {
    padding: 20px;
    gap: 14px;

    .comment-avatar {
      :deep(.n-avatar) {
        --n-size: 44px !important;
      }
    }

    .comment-body {
      .comment-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        margin-bottom: 10px;

        .comment-author {
          font-size: 15px;
        }

        .comment-date {
          font-size: 13px;
        }
      }

      .comment-content {
        font-size: 14px;
        line-height: 1.65;
      }
    }
  }
}

@media (max-width: 640px) {
  .comments-section {
    padding: 28px 24px;
  }

  .section-header {
    margin-bottom: 20px;

    h2 {
      font-size: 18px;
      gap: 10px;

      span[class^="i-"] {
        font-size: 22px;
      }
    }
  }

  .comment-form {
    padding: 16px;
    margin-bottom: 24px;

    h3 {
      font-size: 16px;
      margin-bottom: 16px;
    }

    :deep(.n-form-item) {
      margin-bottom: 16px;
    }

    :deep(.n-form-item-label) {
      font-size: 13px;
    }

    :deep(.n-input) {
      font-size: 13px;

      &.n-input--textarea {
        .n-input__textarea-el {
          min-height: 100px !important;
        }
      }
    }

    :deep(.n-button) {
      height: 40px;
      font-size: 13px;
      padding: 0 20px;
    }
  }

  .comments-list {
    gap: 16px;
  }

  .comment-item {
    padding: 14px;
    gap: 10px;

    .comment-avatar {
      :deep(.n-avatar) {
        --n-size: 36px !important;
        font-size: 14px;
      }
    }

    .comment-body {
      .comment-header {
        gap: 5px;
        margin-bottom: 8px;

        .comment-author {
          font-size: 13px;
        }

        .comment-date {
          font-size: 11px;
        }
      }

      .comment-content {
        font-size: 12px;
        line-height: 1.6;
      }
    }
  }
}

@media (max-width: 480px) {
  .comments-section {
    padding: 24px 20px;
  }

  .comment-form {
    padding: 14px;
    margin-bottom: 20px;

    h3 {
      font-size: 15px;
    }
  }

  .comment-item {
    padding: 12px;
    gap: 8px;

    .comment-avatar {
      :deep(.n-avatar) {
        --n-size: 32px !important;
      }
    }
  }
}
</style>
