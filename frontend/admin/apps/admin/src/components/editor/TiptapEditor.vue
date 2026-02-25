<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/vue-3';

interface Props {
  modelValue: string;
  height?: number | string;
  disabled?: boolean;
  placeholder?: string;
  config?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  height: 500,
  disabled: false,
  placeholder: 'Please enter content...',
  config: () => ({}),
});

const emit = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'ready'): void;
  (e: 'update:modelValue', value: string): void;
}>();

const contentRef = ref(props.modelValue);

const resolvedHeight = computed(() => {
  if (typeof props.height === 'number') {
    return `${props.height}px`;
  }
  return props.height;
});

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  editable: !props.disabled,
  autofocus: 'end',
  onCreate: () => {
    emit('ready');
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    contentRef.value = html;
    emit('update:modelValue', html);
    emit('change', html);
  },
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (editor.value && newVal !== contentRef.value) {
      editor.value.commands.setContent(newVal);
      contentRef.value = newVal;
    }
  },
);

watch(
  () => props.disabled,
  (newVal) => {
    if (editor.value) {
      editor.value.setEditable(!newVal);
    }
  },
);

watch(
  () => editor.value,
  () => {
    if (!editor.value) return;
    if (editor.value.isActive && !editor.value.isActive('')) {
      emit('ready');
    }
  },
);
</script>

<template>
  <div class="tiptap-editor-wrapper">
    <EditorContent :editor="editor" class="tiptap-editor-content" />
  </div>
</template>

<style scoped>
.tiptap-editor-wrapper {
  width: 100%;
  height: v-bind('resolvedHeight');
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tiptap-editor-content {
  flex: 1;
  overflow-y: auto;
}

/* Tiptap Editor Base Styles */
:deep(.ProseMirror) {
  padding: 12px;
  outline: none;
  min-height: 100%;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2937;
  white-space: pre-wrap;
  word-wrap: break-word;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #d1d5db;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Markdown-like formatting */
:deep(.ProseMirror h1) {
  font-size: 28px;
  font-weight: 700;
  margin: 16px 0;
}

:deep(.ProseMirror h2) {
  font-size: 24px;
  font-weight: 700;
  margin: 12px 0;
}

:deep(.ProseMirror h3) {
  font-size: 20px;
  font-weight: 700;
  margin: 8px 0;
}

:deep(.ProseMirror p) {
  margin: 8px 0;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  margin: 8px 0;
  padding-left: 24px;
}

:deep(.ProseMirror code) {
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
}

:deep(.ProseMirror pre) {
  background-color: #1f2937;
  color: #f3f4f6;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 8px 0;
}

:deep(.ProseMirror pre code) {
  background: none;
  color: inherit;
  padding: 0;
  border-radius: 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 12px;
  color: #6b7280;
  margin: 8px 0;
  font-style: italic;
}

:deep(.ProseMirror strong) {
  font-weight: 700;
}

:deep(.ProseMirror em) {
  font-style: italic;
}

:deep(.ProseMirror a) {
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
}

:deep(.ProseMirror a:hover) {
  color: #2563eb;
}

/* Dark mode support */
:deep(.dark .ProseMirror) {
  background-color: #1f2937;
  color: #f3f4f6;
}

:deep(.dark .ProseMirror code) {
  background-color: #374151;
  color: #f3f4f6;
}

:deep(.dark .ProseMirror blockquote) {
  border-left-color: #4b5563;
  color: #d1d5db;
}

:deep(.dark .ProseMirror a) {
  color: #60a5fa;
}

:deep(.dark .ProseMirror a:hover) {
  color: #93c5fd;
}
</style>
