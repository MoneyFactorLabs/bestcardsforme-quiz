import type { ArticleScorecard } from "@/types/article";
import { Scorecard } from "@/components/platform/Scorecard";

type ArticleMoneyFactorScorecardProps = {
  scorecard: ArticleScorecard;
};

export function ArticleMoneyFactorScorecard({ scorecard }: ArticleMoneyFactorScorecardProps) {
  return (
    <Scorecard
      title="Scored for practical household value"
      summary={scorecard.summary}
      overallScore={scorecard.overallScore}
      metrics={[
        { label: "Rewards Value", value: scorecard.rewardsValue },
        { label: "Fee Justification", value: scorecard.feeJustification },
        { label: "Travel Utility", value: scorecard.travelUtility },
        { label: "Everyday Use", value: scorecard.everydayUse },
        { label: "Beginner Friendliness", value: scorecard.beginnerFriendliness },
      ]}
    />
  );
}
