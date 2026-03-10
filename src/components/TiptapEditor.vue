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
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        title="Heading 3"
      >
        <span class="font-bold text-sm">H3</span>
      </button>
      <div class="w-px h-6 bg-gray-300 mx-2"></div>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('code') }"
        @click="editor.chain().focus().toggleCode().run()"
        title="Inline Code"
      >
        <i class="fas fa-code"></i>
      </button>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        :class="{ 'bg-gray-200 text-indigo-600': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        title="Code Block"
      >
        <i class="fas fa-terminal"></i>
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
        title="Horizontal Line"
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
      <div class="w-px h-6 bg-gray-300 mx-2"></div>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        title="Undo"
      >
        <i class="fas fa-undo"></i>
      </button>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        title="Redo"
      >
        <i class="fas fa-redo"></i>
      </button>
      <button
        class="p-1 mx-1 rounded hover:bg-gray-200 transition-colors"
        @click="editor.chain().focus().unsetAllMarks().clearNodes().run()"
        title="Clear Formatting"
      >
        <i class="fas fa-remove-format"></i>
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
      heading: {
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'font-bold text-gray-900 my-4',
        },
      },
      blockquote: {
        HTMLAttributes: {
          class: 'border-l-4 border-purple-400 pl-4 italic my-4 text-gray-700 bg-purple-50 py-2 rounded-r',
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: 'list-disc list-outside ml-4 my-4 space-y-2',
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: 'list-decimal list-outside ml-4 my-4 space-y-2',
        },
      },
      listItem: {
        HTMLAttributes: {
          class: 'leading-relaxed',
        },
      },
      codeBlock: {
        HTMLAttributes: {
          class: 'bg-gray-100 rounded-md p-4 font-mono text-sm my-4 border border-gray-200 overflow-x-auto',
        },
      },
      horizontalRule: {
        HTMLAttributes: {
          class: 'my-8 border-t-2 border-gray-200',
        },
      },
      paragraph: {
        HTMLAttributes: {
          class: 'mb-4 leading-relaxed text-gray-700',
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
    // Handle paste to prevent extra line breaks
    transformPastedHTML(html) {
      // If the pasted content has only one <p> tag and no other sibling tags, remove the <p> tag to keep it on the same line
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const body = doc.body;
      
      // Check if there is only one element node and it is a P tag
      // Also ensure there are no non-empty text nodes as sibling nodes
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
    // Handle plain text paste, converting line breaks to <br> instead of new paragraphs (optional, based on requirement)
    // But usually we still want to keep paragraphs, just solving the issue of a single paragraph being forced to wrap
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
    // Reset input to allow selecting the same image again
    event.target.value = ''
  }
}

// Exposed for external use to insert images
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
