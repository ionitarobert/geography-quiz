import { useState, useEffect, useCallback, useRef } from "react";
import type { CountryFeature, FeedbackState, QuestionLimit } from "../types";
import { useCountries } from "./useCountries";

function pickRandom<T>(arr: T[], exclude: T[]): T {
  const pool = arr.filter((x) => !exclude.includes(x));
  if (pool.length === 0) return arr[Math.floor(Math.random() * arr.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useQuiz(limit: QuestionLimit) {
  const countries = useCountries();
  const [target, setTarget] = useState<CountryFeature | null>(null);
  const [lastClicked, setLastClicked] = useState<CountryFeature | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);
  const recentRef = useRef<CountryFeature[]>([]);

  useEffect(() => {
    if (countries.length === 0 || target !== null) return;
    const first = pickRandom(countries, []);
    recentRef.current = [first];
    setTarget(first);
  }, [countries, target]);

  const advance = useCallback((next: CountryFeature) => {
    recentRef.current = [...recentRef.current.slice(-9), next];
    setTarget(next);
    setLastClicked(null);
    setFeedback(null);
  }, []);

  const handleCountryClick = useCallback(
    (feature: CountryFeature) => {
      if (feedback !== null || !target || finished) return;

      const isCorrect = feature.properties.name === target.properties.name;
      const newTotal = total + 1;
      const reachedLimit = limit !== null && newTotal >= limit;

      setLastClicked(feature);
      setTotal(newTotal);
      if (isCorrect) setScore((s) => s + 1);
      setFeedback(isCorrect ? "correct" : "wrong");

      setTimeout(() => {
        if (reachedLimit) {
          setFinished(true);
          return;
        }
        const next = pickRandom(countries, recentRef.current);
        advance(next);
      }, 1500);
    },
    [feedback, target, finished, total, limit, countries, advance],
  );

  return {
    countries,
    target,
    lastClicked,
    feedback,
    score,
    total,
    finished,
    handleCountryClick,
  };
}
