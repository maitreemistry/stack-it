import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import QuestionList from '@/components/QuestionList';
import AskQuestionModal from '@/components/AskQuestionModal';

const Index = () => {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAskQuestion={handleAskQuestion} />
      <HeroSection onAskQuestion={handleAskQuestion} />
      <QuestionList onAskQuestion={handleAskQuestion} />
      
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitQuestion}
      />
    </div>
  );
};

export default Index;
