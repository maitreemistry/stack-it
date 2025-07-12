import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import QuestionList from '@/components/QuestionList';
import AskQuestionModal from '@/components/AskQuestionModal';
import { createQuestion } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/lib/UserContext';

const Index = () => {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleAskQuestion = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to ask a question.",
        variant: "destructive"
      });
      return;
    }
    setIsAskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAskModalOpen(false);
  };

  const handleSubmitQuestion = async (questionData: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to ask a question.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createQuestion({
        title: questionData.title,
        body: questionData.content,
        tags: questionData.tags
      });

      if (result.success) {
        toast({
          title: "Question posted!",
          description: "Your question has been successfully posted.",
        });
        handleCloseModal();
        // Refresh the page to show the new question
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to post question",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error creating question:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to post question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHeroSearch = (query: string) => {
    setHeroSearchQuery(query);
    // Scroll to questions section when searching
    if (query.trim()) {
      const questionsSection = document.querySelector('section');
      if (questionsSection) {
        questionsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAskQuestion={handleAskQuestion} />
      <HeroSection onAskQuestion={handleAskQuestion} onSearch={handleHeroSearch} />
      <QuestionList onAskQuestion={handleAskQuestion} initialSearchQuery={heroSearchQuery} />
      
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitQuestion}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Index;
