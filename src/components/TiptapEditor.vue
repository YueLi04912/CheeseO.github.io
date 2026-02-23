<template>
    <div class="border border-gray-300 rounded-md">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="flex flex-wrap items-center p-2 border-b border-gray-300 bg-gray-50">
          <button
            class="p-1 mx-1 rounded hover:bg-gray-200"
            :class="{ 'bg-gray-200': isActive.bold() }"
            @click="commands.bold"
          >
            <i class="fas fa-bold"></i>
          </button>
          <button
            class="p-1 mx-1 rounded hover:bg-gray-200"
            :class="{ 'bg-gray-200': isActive.italic() }"
            @click="commands.italic"
          >
            <i class="fas fa-italic"></i>
          </button>
          <button
            class="p-1 mx-1 rounded hover:bg-gray-200"
            :class="{ 'bg-gray-200': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >
            H1
          </button>
          <button
            class="p-1 mx-1 rounded hover:bg-gray-200"
            :class="{ 'bg-gray-200': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </button>
          <button
            class="p-1 mx-1 rounded hover:bg-gray-200"
            @click="commands.bullet_list"
          >
            <i class="fas fa-list-ul"></i>
          </button>
          <button
            class="p-1 mx-1 rounded hover:bg-gray-200"
            @click="commands.ordered_list"
          >
            <i class="fas fa-list-ol"></i>
          </button>
          <button
            class="p-1 mx-1 rounded hover:bg-gray-200"
            @click="commands.blockquote"
          >
            <i class="fas fa-quote-right"></i>
          </button>
          <button
            class="p-1 mx-1 rounded hover:bg-gray-200"
            @click="commands.horizontal_rule"
          >
            <i class="fas fa-minus"></i>
          </button>
          <button
            class="p-1 mx-1 rounded hover:bg-gray-200"
            @click="showImagePrompt(commands.image)"
          >
            <i class="fas fa-image"></i>
          </button>
        </div>
      </editor-menu-bar>
      <editor-content
        class="p-4 min-h-[300px] prose max-w-none"
        :editor="editor"
      />
    </div>
  </template>
  
  <script>
  import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
  import {
    Heading,
    Bold,
    Italic,
    Blockquote,
    BulletList,
    OrderedList,
    ListItem,
    HorizontalRule,
    Image
  } from 'tiptap-extensions'
  
  export default {
    components: {
      EditorContent,
      EditorMenuBar
    },
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        editor: new Editor({
          extensions: [
            new Heading({ levels: [1, 2] }),
            new Bold(),
            new Italic(),
            new Blockquote(),
            new BulletList(),
            new OrderedList(),
            new ListItem(),
            new HorizontalRule(),
            new Image()
          ],
          content: this.value,
          onUpdate: ({ getHTML }) => {
            this.$emit('input', getHTML())
          }
        })
      }
    },
    methods: {
      showImagePrompt(command) {
        const url = window.prompt('Enter Image URL')
        if (url) command({ src: url })
      }
    },
    beforeDestroy() {
      this.editor.destroy()
    }
  }
  </script>