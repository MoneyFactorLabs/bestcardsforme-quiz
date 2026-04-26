"use client";

import { useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { EmailCapture } from "@/components/EmailCapture";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { PopularNonFitCards } from "@/components/PopularNonFitCards";
import { ProgressBar } from "@/components/ProgressBar";
import { ProfileSummary } from "@/components/ProfileSummary";
import { QuizQuestion } from "@/components/QuizQuestion";
import { ResultsCard } from "@/components/ResultsCard";
import { quizQuestions } from "@/data/questions";
import {
  getPopularNonFits,
  getProfileSummary,
  getRecommendations,
} from "@/lib/recommendationEngine";
import { trackEvent } from "@/lib/analyticsClient";
import type { QuizAnswers } from "@/types/quiz";

type Screen = "landing" | "quiz" | "results";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const selectedValue = answers[currentQuestion?.id];

  const recommendations = useMemo(() => {
    if (screen !== "results") return [];
    return getRecommendations(answers as QuizAnswers);
  }, [answers, screen]);

  const popularNonFits = useMemo(() => {
    if (screen !== "results") return [];
    return getPopularNonFits(answers as QuizAnswers);
  }, [answers, screen]);

  const profileSummary = useMemo(() => {
    if (screen !== "results") return null;
    return getProfileSummary(answers as QuizAnswers);
  }, [answers, screen]);

  function handleStart() {
    setScreen("quiz");
  }

  function handleSelect(value: string) {
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };

    setAnswers(nextAnswers);

    if (isLastQuestion) {
      const completedAnswers = nextAnswers as QuizAnswers;
      const topRecommendations = getRecommendations(completedAnswers);

      trackEvent({
        eventName: "quiz_completed",
        sourcePage: "quiz",
        metadata: {
          main_goal: completedAnswers.mainGoal,
          annual_fee_comfort: completedAnswers.annualFeeComfort,
          monthly_spend: completedAnswers.monthlySpend,
          top_category: completedAnswers.topCategory,
          travel_frequency: completedAnswers.travelFrequency,
          top_cards: topRecommendations.map((recommendation) => recommendation.card.id),
        },
      });
      setScreen("results");
      return;
    }

    window.setTimeout(() => {
      setCurrentQuestionIndex((index) => Math.min(index + 1, quizQuestions.length - 1));
    }, 120);
  }

  function handleBack() {
    if (currentQuestionIndex === 0) {
      setScreen("landing");
      return;
    }

    setCurrentQuestionIndex((index) => Math.max(0, index - 1));
  }

  function handleRestart() {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScreen("landing");
  }

  return (
    <main className="min-h-screen">
      <Header />

      {screen === "landing" && <LandingHero onStart={handleStart} />}

      {screen === "quiz" && (
        <section className="mx-auto w-full max-w-3xl px-4 pb-12 pt-6 sm:px-8 sm:pb-16 sm:pt-8">
          <div className="rounded-lg border border-blue-gray/70 bg-white p-4 shadow-soft sm:p-8">
            <ProgressBar currentStep={currentQuestionIndex + 1} totalSteps={quizQuestions.length} />
            <div className="mt-8">
              <QuizQuestion
                question={currentQuestion}
                selectedValue={selectedValue}
                onSelect={handleSelect}
              />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="focus-ring rounded-md border border-blue-gray px-5 py-3 text-sm font-bold text-mid-navy transition hover:border-navy hover:text-navy"
              >
                Back
              </button>
              <p className="text-sm font-medium text-mid-navy/60 sm:text-right">
                Your answers are used only to calculate this recommendation session.
              </p>
            </div>
          </div>
        </section>
      )}

      {screen === "results" && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-8">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
                Your top matches
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight text-navy sm:text-5xl">
                Cards ranked for your actual spending life.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-mid-navy/75">
                These recommendations are personalized to your fee comfort, travel habits, reward
                style, and strongest spend category.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="focus-ring rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
            >
              Restart quiz
            </button>
          </div>

          {profileSummary && (
            <div className="mb-5">
              <ProfileSummary profile={profileSummary} answers={answers as QuizAnswers} />
            </div>
          )}

          <div className="grid gap-4 sm:gap-5">
            {recommendations.map((recommendation, index) => (
              <ResultsCard
                key={recommendation.card.id}
                recommendation={recommendation}
                rank={index + 1}
              />
            ))}
          </div>

          <div className="mt-5 grid gap-5">
            <PopularNonFitCards cards={popularNonFits} />
            <EmailCapture />
            <Disclaimer />
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
