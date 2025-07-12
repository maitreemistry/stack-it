import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import QuestionList from '@/components/QuestionList';
import AskQuestionModal from '@/components/AskQuestionModal';

const Index = () => {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');

  const handleAskQuestion = () => {
    setIsAskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAskModalOpen(false);
  };

  const handleSubmitQuestion = (questionData: any) => {
    console.log('New question submitted:', questionData);
    // Here you would typically send the data to your backend
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
      />
    </div>
  );
};

export default Index;
