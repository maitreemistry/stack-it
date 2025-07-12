import React, { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import CodeBlock from '@tiptap/extension-code-block';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Quote,
  Undo,
  Redo,
  Type,
  Minus,
  Trash2
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here...", minHeight = "200px" }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true }),
      Heading.configure({ levels: [1, 2, 3] }),
      CodeBlock,
      HorizontalRule
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none min-h-[${minHeight}] focus:outline-none px-4 py-2 bg-background [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[${minHeight}] [&_.ProseMirror]:p-0 [&_.ProseMirror]:m-0 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_pre]:bg-gray-900 [&_pre]:border [&_pre]:border-gray-700 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:shadow-lg [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0 [&_pre_code]:font-mono [&_pre_code]:text-sm [&_pre_code]:leading-relaxed`,
        placeholder: placeholder,
      },
      handleKeyDown: (view, event) => {
        // Handle backtick for inline code
        if (event.key === '`') {
          const { from, to } = view.state.selection;
          const selectedText = view.state.doc.textBetween(from, to);
          
          if (selectedText.trim()) {
            // If text is selected, wrap it in backticks
            event.preventDefault();
            view.dispatch(view.state.tr.replaceWith(
              from, 
              to, 
              view.state.schema.text('`' + selectedText + '`')
            ));
            return true;
          }
        }
        
        // Handle triple backticks for code blocks
        const { from } = view.state.selection;
        const $pos = view.state.doc.resolve(from);
        const textBefore = view.state.doc.textBetween(Math.max(0, from - 3), from);
        
        if (textBefore.endsWith('```')) {
          event.preventDefault();
          // Remove the backticks and insert code block
          view.dispatch(view.state.tr.delete(from - 3, from).setBlockType(from - 3, from - 3, view.state.schema.nodes.codeBlock));
          return true;
        }
        
        // Handle > for blockquotes
        if (event.key === '>') {
          const { from } = view.state.selection;
          const $pos = view.state.doc.resolve(from);
          const isAtStart = $pos.parentOffset === 0;
          
          if (isAtStart) {
            event.preventDefault();
            // Insert blockquote
            view.dispatch(view.state.tr.setBlockType(from, from, view.state.schema.nodes.blockquote));
            return true;
          }
        }
        
        return false;
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Only update content if value changes and editor is not focused (prevents cursor jump)
  const lastValue = useRef(value);
  useEffect(() => {
    if (editor && value !== lastValue.current && !editor.isFocused) {
      editor.commands.setContent(value || '', false);
      lastValue.current = value;
    }
    // eslint-disable-next-line
  }, [value]);

  // Handle intelligent code insertion
  const handleCodeToggle = () => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    
    if (selectedText.trim()) {
      // If text is selected, toggle inline code
      editor.chain().focus().toggleCode().run();
    } else {
      // If no text selected, check if we're at the start of a line
      const $pos = editor.state.doc.resolve(from);
      const isAtStart = $pos.parentOffset === 0;
      
      if (isAtStart) {
        // Insert code block
        editor.chain().focus().toggleCodeBlock().run();
      } else {
        // Insert inline code
        editor.chain().focus().toggleCode().run();
      }
    }
  };

  if (!editor) return <div className="p-4 text-muted-foreground">Loading editor...</div>;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        {/* Headings */}
        <Button
          variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 px-2"
          title="Heading 1"
          type="button"
        >
          <span className="text-sm font-bold">H1</span>
        </Button>
        <Button
          variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 px-2"
          title="Heading 2"
          type="button"
        >
          <span className="text-sm font-bold">H2</span>
        </Button>
        <Button
          variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="h-8 px-2"
          title="Heading 3"
          type="button"
        >
          <span className="text-sm font-bold">H3</span>
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        {/* Formatting */}
        <Button
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
          title="Bold"
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
          title="Italic"
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0"
          title="Underline"
          type="button"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8 p-0"
          title="Strikethrough"
          type="button"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        {/* Lists */}
        <Button
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
          title="Bullet List"
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
          title="Numbered List"
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0"
          title="Quote"
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('code') || editor.isActive('codeBlock') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={handleCodeToggle}
          className="h-8 w-8 p-0"
          title="Code (Inline/Block)"
          type="button"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="h-8 w-8 p-0"
          title="Horizontal Rule"
          type="button"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('link') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter the link URL');
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
          }}
          className="h-8 w-8 p-0"
          title="Insert Link"
          type="button"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="h-8 w-8 p-0"
          title="Clear Formatting"
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          className="h-8 w-8 p-0"
          title="Undo"
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          className="h-8 w-8 p-0"
          title="Redo"
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;