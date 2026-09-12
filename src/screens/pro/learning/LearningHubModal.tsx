/**
 * POPCIX PRO - Learning Hub Modal
 * Video lessons, skills quizzes, certifications, and safety policy modules.
 */

import React, { useState } from 'react';
import { TRAINING_LESSONS, TRAINING_QUIZZES } from '../../../data/proMockData';
import { TrainingLesson } from '../../../types/pro';
import { useProGamification } from '../../../context/ProGamificationContext';

interface LearningHubModalProps {
  onClose: () => void;
}

export function LearningHubModal({ onClose }: LearningHubModalProps) {
  const [selectedLesson, setSelectedLesson] = useState<TrainingLesson | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const { addXp } = useProGamification();

  const handleFinishLesson = (lesson: TrainingLesson) => {
    addXp(100, `Completed module: ${lesson.title}`);
    setSelectedLesson(null);
  };

  const handleTakeQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setQuizScore(100);
    addXp(200, 'Passed Skill Certification Quiz');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-[90vh] sm:h-[84vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-[#E5E5E0]">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E5E0] px-4 py-3 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block">
              POPCIX ACADEMY
            </span>
            <h3 className="text-sm font-black text-[#111111]">
              Learning & Certifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F0EB] text-[#333333] font-bold text-sm flex items-center justify-center hover:bg-[#E5E5E0]"
          >
            ✕
          </button>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Lesson Player if selected */}
          {selectedLesson ? (
            <div className="bg-[#F8F8F5] rounded-2xl p-4 border border-[#E5E5E0] space-y-3">
              <img
                src={selectedLesson.thumbnail}
                alt={selectedLesson.title}
                className="w-full h-40 rounded-xl object-cover"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#000000] text-white px-2 py-0.5 rounded-md">
                {selectedLesson.category} • {selectedLesson.durationMin} MINS
              </span>
              <h2 className="text-sm font-bold text-[#111111]">{selectedLesson.title}</h2>
              <p className="text-xs text-[#555555] leading-relaxed">{selectedLesson.summary}</p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="flex-1 py-2 bg-white border border-[#E5E5E0] rounded-xl text-xs font-bold"
                >
                  Back
                </button>
                <button
                  onClick={() => handleFinishLesson(selectedLesson)}
                  className="flex-2 py-2 bg-black text-white rounded-xl text-xs font-bold"
                >
                  Mark Module Completed (+100 XP)
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Certification Banner */}
              <div className="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white p-4 rounded-2xl shadow-md">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFAA00] block mb-1">
                  OFFICIAL CERTIFICATE
                </span>
                <h3 className="text-sm font-black mb-1">Certified AC Deep Cleaning Specialist</h3>
                <p className="text-xs text-white/80 mb-2">Verified badge active on your customer-facing profile.</p>
                <span className="inline-block text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full">
                  ✓ Score: 100% (Passed)
                </span>
              </div>

              {/* Lessons List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                  TRAINING MODULES & VIDEOS
                </h3>
                {TRAINING_LESSONS.map(lesson => (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className="p-3 bg-white rounded-2xl border border-[#E5E5E0] shadow-xs flex items-center gap-3 cursor-pointer hover:border-black transition-colors"
                  >
                    <img
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-[#6B6B6B]">{lesson.category}</span>
                        <span className="text-[10px] text-[#888888]">• {lesson.durationMin}m</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#111111] truncate">{lesson.title}</h4>
                      <div className="text-[10px] text-[#10B981] font-semibold mt-1">
                        {lesson.completed ? '✓ Completed' : `${lesson.progressPercent}% in progress`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quizzes List */}
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                  SKILL ASSESSMENTS & QUIZZES
                </h3>
                {TRAINING_QUIZZES.map(quiz => (
                  <div
                    key={quiz.id}
                    className="p-3.5 bg-[#F8F8F5] rounded-2xl border border-[#EBEBE6] flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-[#111111]">{quiz.title}</h4>
                      <p className="text-[10px] text-[#6B6B6B]">{quiz.questionsCount} questions • Passing: {quiz.passingScorePercent}%</p>
                    </div>
                    {quiz.passed ? (
                      <span className="text-[10px] font-bold text-[#047857] bg-[#10B981]/15 px-2 py-1 rounded-lg shrink-0">
                        ✓ Passed ({quiz.userScorePercent}%)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleTakeQuiz(quiz.id)}
                        className="text-[11px] font-bold px-3 py-1.5 bg-black text-white rounded-xl shrink-0"
                      >
                        Take Test
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
