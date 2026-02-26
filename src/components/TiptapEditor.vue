<template>
  <div class="border border-gray-300 rounded-md bg-white">
    <div v-if="editor" class="flex flex-wrap items-center p-2 border-b border-gray-300 bg-gray-50 rounded-t-md">
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
        title="Bold"
      >
        <i class="fas fa-bold"></i>
      </button>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
        title="Italic"
      >
        <i class="fas fa-italic"></i>
      </button>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        title="Heading 1"
      >
        <span class="font-bold text-sm">H1</span>
      </button>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        title="Heading 2"
      >
        <span class="font-bold text-sm">H2</span>
      </button>
      <div class="w-px h-6 bg-gray-300 mx-2"></div>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
        title="Bullet List"
      >
        <i class="fas fa-list-ul"></i>
      </button>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
        title="Ordered List"
      >
        <i class="fas fa-list-ol"></i>
      </button>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
        title="Blockquote"
      >
        <i class="fas fa-quote-right"></i>
      </button>
      <div class="w-px h-6 bg-gray-300 mx-2"></div>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        @click="editor.chain().focus().setHorizontalRule().run()"
        title="Horizontal Rule"
      >
        <i class="fas fa-minus"></i>
      </button>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        @click="triggerImageUpload"
        title="Insert Image"
      >
        <i class="fas fa-image"></i>
      </button>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/*"
        @change="handleFileChange"
      />
    </div>
    <editor-content
      class="p-4"
      :editor="editor"
    />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { watch, ref } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Write something amazing...',
  },
})

const emit = defineEmits(['input', 'upload-image'])

const fileInput = ref(null)

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      // 可以在这里配置 StarterKit 的组件
      paragraph: {
        HTMLAttributes: {
          class: 'mb-4 leading-relaxed',
        },
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto my-4 mx-auto block shadow-md',
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  editorProps: {
     attributes: {
       class: 'focus:outline-none min-h-[300px] prose prose-sm sm:prose max-w-none break-words',
     },
    // 处理粘贴，防止多余换行
    transformPastedHTML(html) {
      // 如果粘贴的内容只有一个 <p> 标签且没有其他同级标签，去掉 <p> 标签以保持在同一行
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const body = doc.body;
      
      // 检查是否只有一个元素节点，且该节点是 P 标签
      // 同时确保没有非空的文本节点作为同级节点
      const hasOnlyOneP = body.children.length === 1 && body.firstElementChild.nodeName === 'P';
      const hasNoOtherText = Array.from(body.childNodes).every(node => {
        if (node.nodeType === Node.TEXT_NODE) return !node.textContent.trim();
        return node === body.firstElementChild;
      });

      if (hasOnlyOneP && hasNoOtherText) {
        return body.firstElementChild.innerHTML;
      }
      return html;
    },
    // 处理纯文本粘贴，将换行转换为 <br> 而不是新段落（可选，根据需求）
    // 但通常我们还是希望保留段落，只是解决单个段落被强制换行的问题
  },
  content: props.value,
  onUpdate: ({ editor }) => {
    emit('input', editor.getHTML())
  },
})

watch(() => props.value, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue, false)
  }
})

const triggerImageUpload = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('upload-image', file)
    // 重置 input，方便下次选择同一张图
    event.target.value = ''
  }
}

// 供外部调用插入图片
const insertImage = (url) => {
  if (editor.value && url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const setHTML = (html) => {
  if (editor.value) {
    editor.value.commands.setContent(html || '', false)
  }
}

defineExpose({
  insertImage,
  setHTML,
})
</script>

<style scoped>
:deep(.ProseMirror) {
  outline: none;
  min-height: 300px;
}
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
