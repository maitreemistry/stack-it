import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Code, 
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile,
  Undo,
  Redo,
  Type
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const emojis = ['😀', '😂', '❤️', '👍', '👎', '😊', '😎', '🤔', '😔', '😡', '🎉', '🚀', '💡', '⭐', '✅', '❌', '🔥', '💯'];

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here...", minHeight = "200px" }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  const insertEmoji = useCallback((emoji: string) => {
    executeCommand('insertText', emoji);
  }, [executeCommand]);

  const insertLink = useCallback(() => {
    if (linkUrl && linkText) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">${linkText}</a>`;
      executeCommand('insertHTML', link);
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  }, [linkUrl, linkText, executeCommand]);

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      const img = `<img src="${url}" alt="Image" class="max-w-full h-auto rounded-lg my-2" />`;
      executeCommand('insertHTML', img);
    }
  }, [executeCommand]);

  const insertCodeBlock = useCallback(() => {
    const code = prompt('Enter code:');
    if (code) {
      const codeBlock = `<pre class="bg-muted p-3 rounded-lg my-2 overflow-x-auto"><code>${code}</code></pre>`;
      executeCommand('insertHTML', codeBlock);
    }
  }, [executeCommand]);

  const formatText = useCallback((format: string) => {
    switch (format) {
      case 'bold':
        executeCommand('bold');
        break;
      case 'italic':
        executeCommand('italic');
        break;
      case 'underline':
        executeCommand('underline');
        break;
      case 'strikethrough':
        executeCommand('strikeThrough');
        break;
      case 'unorderedList':
        executeCommand('insertUnorderedList');
        break;
      case 'orderedList':
        executeCommand('insertOrderedList');
        break;
      case 'quote':
        executeCommand('formatBlock', 'blockquote');
        break;
      case 'alignLeft':
        executeCommand('justifyLeft');
        break;
      case 'alignCenter':
        executeCommand('justifyCenter');
        break;
      case 'alignRight':
        executeCommand('justifyRight');
        break;
      case 'undo':
        executeCommand('undo');
        break;
      case 'redo':
        executeCommand('redo');
        break;
      default:
        break;
    }
  }, [executeCommand]);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            className="h-8 w-8 p-0"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            className="h-8 w-8 p-0"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('underline')}
            className="h-8 w-8 p-0"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('strikethrough')}
            className="h-8 w-8 p-0"
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('unorderedList')}
            className="h-8 w-8 p-0"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('orderedList')}
            className="h-8 w-8 p-0"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('quote')}
            className="h-8 w-8 p-0"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('alignLeft')}
            className="h-8 w-8 p-0"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('alignCenter')}
            className="h-8 w-8 p-0"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('alignRight')}
            className="h-8 w-8 p-0"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Insert Elements */}
        <div className="flex items-center gap-1">
          <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Insert Link"
              >
                <Link className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="linkText">Link Text</Label>
                  <Input
                    id="linkText"
                    placeholder="Enter link text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={insertLink} size="sm" className="flex-1">
                    Insert Link
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLinkDialog(false)} 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="sm"
            onClick={insertImage}
            className="h-8 w-8 p-0"
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertCodeBlock}
            className="h-8 w-8 p-0"
            title="Insert Code"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Insert Emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => insertEmoji(emoji)}
                  className="h-8 w-8 p-0 text-lg"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('undo')}
            className="h-8 w-8 p-0"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('redo')}
            className="h-8 w-8 p-0"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 outline-none focus:ring-0"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid hsl(var(--secondary));
          padding-left: 16px;
          margin: 8px 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        
        [contenteditable] ul {
          list-style-type: disc;
          margin-left: 20px;
          margin: 8px 0 8px 20px;
        }
        
        [contenteditable] ol {
          list-style-type: decimal;
          margin: 8px 0 8px 20px;
        }
        
        [contenteditable] li {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;