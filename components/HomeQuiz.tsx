"use client";

import { useEffect, useMemo, useState } from "react";
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
import { ShortlistAtAGlance } from "@/components/ShortlistAtAGlance";
import { quizQuestions } from "@/data/questions";
import { trackEvent } from "@/lib/analyticsClient";
import {
  getPopularNonFits,
  getProfileSummary,
  getRecommendations,
} from "@/lib/recommendationEngine";
import type { QuizAnswers } from "@/types/quiz";

type Screen = "landing" | "quiz" | "results";

export function HomeQuiz() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  // Each screen opens at its own top: otherwise a phone lands mid-page (e.g. on the
  // email form below the results) wherever the previous screen was scrolled to.
  useEffect(() => {
    if (screen === "landing") return;
    document.getElementById(screen === "quiz" ? "quiz" : "results")?.scrollIntoView({ block: "start" });
  }, [screen]);

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
        <section id="quiz" className="scroll-mt-6 mx-auto w-full max-w-3xl px-4 pb-12 pt-4 sm:px-8 sm:pb-16 sm:pt-8">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-9">
            <ProgressBar currentStep={currentQuestionIndex + 1} totalSteps={quizQuestions.length} />
            <div className="mt-8">
              <QuizQuestion question={currentQuestion} selectedValue={selectedValue} onSelect={handleSelect} />
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="focus-ring rounded-md px-1 py-2 text-left text-sm font-semibold text-mid-navy transition hover:text-navy"
              >
                ← Back
              </button>
              <p className="text-sm text-mid-navy/65 sm:text-right">No signup, no credit check. Answers stay in this session.</p>
            </div>
          </div>
        </section>
      )}

      {screen === "results" && (
        <section id="results" className="scroll-mt-4 mx-auto w-full max-w-6xl px-4 pb-14 pt-4 sm:px-8 sm:pb-16 sm:pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent-ink">Your personalized card shortlist</p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl">
                Cards ranked for your actual spending life.
              </h1>
              {profileSummary ? (
                <p className="mt-2 text-base text-mid-navy/80">
                  Read as a <span className="font-semibold text-navy">{profileSummary.title.toLowerCase()}</span>. Values are estimates for your
                  answers, after each card&apos;s annual fee.
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="focus-ring shrink-0 rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-navy transition hover:border-navy"
            >
              Restart quiz
            </button>
          </div>

          <div className="mt-6">
            <ShortlistAtAGlance recommendations={recommendations} />
          </div>

          <div className="mt-6 grid gap-5">
            {recommendations.map((recommendation, index) => (
              <ResultsCard key={recommendation.card.id} recommendation={recommendation} rank={index + 1} />
            ))}
          </div>

          {profileSummary && (
            <div className="mt-6">
              <ProfileSummary profile={profileSummary} answers={answers as QuizAnswers} />
            </div>
          )}

          <div className="mt-6 grid gap-5">
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
