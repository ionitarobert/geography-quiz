import { useQuiz } from './hooks/useQuiz';
import GlobeView from './components/GlobeView/GlobeView';
import QuizPanel from './components/QuizPanel/QuizPanel';
import Feedback from './components/Feedback/Feedback';
import styles from './App.module.css';

export default function App() {
  const { countries, target, lastClicked, feedback, score, total, handleCountryClick } = useQuiz();

  return (
    <div className={styles.app}>
      <QuizPanel target={target} score={score} total={total} />
      <div className={styles.globeWrapper}>
        <GlobeView
          countries={countries}
          target={target}
          lastClicked={lastClicked}
          feedback={feedback}
          onCountryClick={handleCountryClick}
        />
        <Feedback
          feedback={feedback}
          correctName={target?.properties.name ?? ''}
          clickedName={lastClicked?.properties.name ?? ''}
        />
      </div>
    </div>
  );
}
