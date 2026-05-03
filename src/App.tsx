import { useCallback, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Intro from './components/Intro';
import Selection from './components/Selection';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Atlas from './components/Atlas';
import { useCountries } from './hooks/useCountries';
import type { QuestionLimit, QuizResult, Stage } from './types';
import styles from './App.module.css';

export default function App() {
  const [stage, setStage] = useState<Stage>('intro');
  const [limit, setLimit] = useState<QuestionLimit>(null);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [gameId, setGameId] = useState(0);
  const countries = useCountries();

  const goToIntro = useCallback(() => setStage('intro'), []);
  const goToSelection = useCallback(() => setStage('select'), []);
  const goToAtlas = useCallback(() => setStage('atlas'), []);

  const handleSelectLimit = useCallback((next: QuestionLimit) => {
    setLimit(next);
    setLastResult(null);
    setGameId((id) => id + 1);
    setStage('quiz');
  }, []);

  const handleQuizFinish = useCallback((result: QuizResult) => {
    setLastResult(result);
    setStage('result');
  }, []);

  const showQuizMenu = stage === 'quiz';
  const showAtlasExit = stage === 'atlas';

  return (
    <Box className={styles.root} sx={{ bgcolor: 'background.default' }}>
      <Container maxWidth="lg" className={styles.headerBar}>
        <Box className={styles.breadcrumb} sx={{ color: 'text.secondary' }}>
          <Typography variant="overline">Atlas</Typography>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>/</Typography>
          <Typography variant="overline">{stageLabel(stage)}</Typography>
          {showQuizMenu && (
            <Button
              size="small"
              onClick={goToSelection}
              className={styles.menuButton}
              sx={{ color: 'text.secondary' }}
            >
              Menu
            </Button>
          )}
          {showAtlasExit && (
            <Button
              size="small"
              onClick={goToIntro}
              className={styles.menuButton}
              sx={{ color: 'text.secondary' }}
            >
              Exit
            </Button>
          )}
        </Box>
      </Container>

      {stage === 'intro' && <Intro onStart={goToSelection} onExplore={goToAtlas} />}
      {stage === 'select' && <Selection onSelect={handleSelectLimit} />}
      {stage === 'quiz' && (
        <Quiz key={gameId} limit={limit} onFinish={handleQuizFinish} />
      )}
      {stage === 'result' && lastResult && (
        <Result result={lastResult} onPlayAgain={goToSelection} />
      )}
      {stage === 'atlas' && <Atlas countries={countries} />}
    </Box>
  );
}

function stageLabel(stage: Stage): string {
  switch (stage) {
    case 'intro':
      return 'Welcome';
    case 'select':
      return 'Setup';
    case 'quiz':
      return 'Quiz';
    case 'result':
      return 'Score';
    case 'atlas':
      return 'Explore';
  }
}
