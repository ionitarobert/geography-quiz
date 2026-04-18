import { useState, useEffect, useCallback, useRef } from "react";
import type { CountryFeature, FeedbackState } from "../types";

function pickRandom<T>(arr: T[], exclude: T[]): T {
  const pool = arr.filter((x) => !exclude.includes(x));
  if (pool.length === 0) return arr[Math.floor(Math.random() * arr.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useQuiz() {
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [target, setTarget] = useState<CountryFeature | null>(null);
  const [lastClicked, setLastClicked] = useState<CountryFeature | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const recentRef = useRef<CountryFeature[]>([]);

  useEffect(() => {
    fetch("/countries.geojson")
      .then((r) => r.json())
      .then((data) => {
        const features: CountryFeature[] = data.features;
        setCountries(features);
        const first = pickRandom(features, []);
        recentRef.current = [first];
        setTarget(first);
      });
  }, []);

  const advance = useCallback((next: CountryFeature) => {
    recentRef.current = [...recentRef.current.slice(-9), next];
    setTarget(next);
    setLastClicked(null);
    setFeedback(null);
  }, []);

  const handleCountryClick = useCallback(
    (feature: CountryFeature) => {
      if (feedback !== null || !target) return;

      setLastClicked(feature);
      setTotal((t) => t + 1);

      if (feature.properties.name === target.properties.name) {
        setScore((s) => s + 1);
        setFeedback("correct");
      } else {
        setFeedback("wrong");
      }

      setTimeout(() => {
        const next = pickRandom(countries, recentRef.current);
        advance(next);
      }, 1500);
    },
    [feedback, target, countries, advance],
  );

  return {
    countries,
    target,
    lastClicked,
    feedback,
    score,
    total,
    handleCountryClick,
  };
}
