import { useState } from 'react';
import { X, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import RichTextEditor from './RichTextEditor';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: any) => void;
  isSubmitting?: boolean;
}

export default function AskQuestionModal({ isOpen, onClose, onSubmit, isSubmitting = false }: AskQuestionModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const maxTitleLength = 120;

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim() && tags.length > 0) {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags,
      });
      // Reset form
      setTitle('');
      setContent('');
      setTags([]);
      setNewTag('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl shadow-[var(--shadow-hover)] w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground">Ask a Question</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Question Title*
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your programming question? Be specific."
                className="stackit-input text-lg"
                maxLength={maxTitleLength}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  Be specific and imagine you're asking a question to another person.
                </p>
                <span className={`text-xs ${title.length > maxTitleLength * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {title.length}/{maxTitleLength}
                </span>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Question Details*
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreview(!isPreview)}
                    className="text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {isPreview ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </div>

              {/* Content Area */}
              {isPreview ? (
                <div className="border border-border rounded-lg p-4 min-h-[200px] bg-muted/10">
                  <div className="prose prose-sm max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_pre]:bg-gray-900 [&_pre]:border [&_pre]:border-gray-700 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:shadow-lg [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0 [&_pre_code]:font-mono [&_pre_code]:text-sm [&_pre_code]:leading-relaxed">
                    {content ? (
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                      <p className="text-muted-foreground italic">Nothing to preview yet...</p>
                    )}
                  </div>
                </div>
              ) : (
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Provide more details about your question. Include what you've tried, what you expected to happen, and what actually happened."
                  minHeight="200px"
                />
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Include code examples, error messages, and what you've already tried.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tags* (at least 1, max 5)
              </label>
              {/* Tag Input */}
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag (e.g., javascript, react, python)"
                  className="stackit-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || tags.length >= 5}
                  className="stackit-button-secondary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="stackit-tag cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Tags help categorize your question and make it easier for others to find.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/10">
          <div className="text-sm text-muted-foreground">
            By posting, you agree to our community guidelines.
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || tags.length === 0 || isSubmitting}
              className="stackit-button-primary"
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}