import { useCallback, useEffect } from 'react';
import { Box, Container, Divider, Fade, LinearProgress, Typography } from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '../../hooks/useQuiz';
import { computeAccuracy } from '../../utils';
import type { CountryFeature, QuestionLimit } from '../../types';
import QuizPanel from '../QuizPanel';
import GlobeView from '../GlobeView';
import Feedback from '../Feedback';
import styles from './Quiz.module.css';

const COLOR_BASE = 'rgba(26, 26, 26, 0.06)';
const COLOR_CORRECT = 'rgba(47, 110, 79, 0.55)';
const COLOR_WRONG = 'rgba(168, 70, 58, 0.55)';

function parseLimit(raw: string | undefined): QuestionLimit | 'invalid' {
  if (raw === 'unlimited') return null;
  if (raw === '5' || raw === '10' || raw === '20') return Number(raw) as QuestionLimit;
  return 'invalid';
}

export default function Quiz() {
  const { limit: limitParam } = useParams<{ limit?: string }>();
  const parsed = parseLimit(limitParam);

  if (parsed === 'invalid') {
    return <Navigate to="/select" replace />;
  }

  return <QuizGame limit={parsed} />;
}

function QuizGame({ limit }: { limit: QuestionLimit }) {
  const navigate = useNavigate();
  const {
    countries,
    target,
    lastClicked,
    feedback,
    score,
    total,
    finished,
    handleCountryClick,
  } = useQuiz(limit);

  const accuracy = computeAccuracy(score, total);
  const progressValue = limit === null
    ? Math.min(100, (total % 10) * 10)
    : Math.round((total / limit) * 100);
  const progressLabel = limit === null ? `${total}` : `${total} / ${limit}`;

  useEffect(() => {
    if (finished) {
      navigate('/result', { state: { score, total, accuracy }, replace: true });
    }
  }, [finished, score, total, accuracy, navigate]);

  const getCountryColor = useCallback(
    (feature: CountryFeature): string => {
      if (feature !== lastClicked) return COLOR_BASE;
      if (feedback === 'correct') return COLOR_CORRECT;
      if (feedback === 'wrong') return COLOR_WRONG;
      return COLOR_BASE;
    },
    [lastClicked, feedback],
  );

  return (
    <>
      <Container maxWidth="md" className={styles.main}>
        <QuizPanel target={target} score={score} total={total} accuracy={accuracy} />

        <Divider
          className={styles.divider}
          sx={{ '&::before, &::after': { borderColor: 'divider' } }}
        >
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '0.4em' }}>
            ✻ ✻ ✻
          </Typography>
        </Divider>

        <Box className={styles.globeWrapper}>
          <GlobeView
            countries={countries}
            getCountryColor={getCountryColor}
            onCountryClick={handleCountryClick}
          />
          <Fade in={Boolean(feedback)} unmountOnExit>
            <Box className={styles.feedbackOverlay}>
              <Feedback
                feedback={feedback}
                correctName={target?.properties.name ?? ''}
                clickedName={lastClicked?.properties.name ?? ''}
              />
            </Box>
          </Fade>
        </Box>
      </Container>

      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md" className={styles.footerInner}>
          <Box className={styles.progressRow}>
            <Typography variant="overline" color="text.secondary">
              Progress
            </Typography>
            <Box className={styles.progressBarWrap}>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                className={styles.progressBar}
                sx={{ '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
              />
            </Box>
            <Typography variant="overline" color="text.primary" className={styles.tabularNum}>
              {progressLabel}
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
