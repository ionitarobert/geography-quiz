import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Container, Divider, Fade, Typography } from '@mui/material';
import type { GlobeMethods } from 'react-globe.gl';
import GlobeView from '../GlobeView';
import InfoCard, { type AtlasView } from './InfoCard';
import { useCountryInfo } from '../../hooks/useCountryInfo';
import type { CountryFeature } from '../../types';
import styles from './Atlas.module.css';

const COLOR_BASE = 'rgba(26, 26, 26, 0.06)';
const COLOR_HOVER = 'rgba(138, 122, 92, 0.28)';
const COLOR_SELECTED = 'rgba(138, 122, 92, 0.55)';
const COUNTRY_ALTITUDE = 1.6;
const CAPITAL_ALTITUDE = 0.65;
const RESET_ALTITUDE = 2.5;
const TRANSITION_MS = 1200;

interface Props {
  countries: CountryFeature[];
}

export default function Atlas({ countries }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [selected, setSelected] = useState<CountryFeature | null>(null);
  const [hovered, setHovered] = useState<CountryFeature | null>(null);
  const [view, setView] = useState<AtlasView>('country');

  const selectedName = selected?.properties.name ?? null;
  const info = useCountryInfo(selectedName);

  const moveCamera = useCallback((altitude: number, latlng?: [number, number]) => {
    const globe = globeRef.current;
    if (!globe) return;
    const pov: { lat?: number; lng?: number; altitude: number } = { altitude };
    if (latlng) {
      pov.lat = latlng[0];
      pov.lng = latlng[1];
    }
    globe.pointOfView(pov, TRANSITION_MS);
  }, []);

  useEffect(() => {
    if (selected && view === 'country' && info.data?.latlng) {
      moveCamera(COUNTRY_ALTITUDE, info.data.latlng);
    }
  }, [selected, view, info.data, moveCamera]);

  const handleCountryClick = useCallback(
    (feature: CountryFeature) => {
      if (selected !== feature) {
        setSelected(feature);
        setView('country');
        return;
      }
      if (view === 'country' && info.data?.latlng) {
        setView('capital');
        moveCamera(CAPITAL_ALTITUDE, info.data.latlng);
      } else {
        setSelected(null);
        setView('country');
        moveCamera(RESET_ALTITUDE);
      }
    },
    [selected, view, info.data, moveCamera],
  );

  const handleClose = useCallback(() => {
    setSelected(null);
    setView('country');
    moveCamera(RESET_ALTITUDE);
  }, [moveCamera]);

  const handleToggleView = useCallback(() => {
    if (!info.data?.latlng) return;
    if (view === 'country') {
      setView('capital');
      moveCamera(CAPITAL_ALTITUDE, info.data.latlng);
    } else {
      setView('country');
      moveCamera(COUNTRY_ALTITUDE, info.data.latlng);
    }
  }, [view, info.data, moveCamera]);

  const getCountryColor = useMemo(
    () =>
      (feature: CountryFeature): string => {
        if (feature === selected) return COLOR_SELECTED;
        if (feature === hovered) return COLOR_HOVER;
        return COLOR_BASE;
      },
    [selected, hovered],
  );

  return (
    <>
      <Container maxWidth="md" className={styles.main}>
        <Box component="header" className={styles.headerText}>
          <Typography
            variant="overline"
            color="text.secondary"
            component="p"
            className={styles.label}
          >
            Explore the world
          </Typography>
          <Typography variant="h1" component="h1" className={styles.title}>
            {selected?.properties.name ?? 'Pick a country'}
          </Typography>
        </Box>

        <Divider
          className={styles.divider}
          sx={{ '&::before, &::after': { borderColor: 'divider' } }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', letterSpacing: '0.4em' }}
          >
            ✻ ✻ ✻
          </Typography>
        </Divider>

        <Box
          className={styles.globeWrapper}
          sx={{ cursor: hovered ? 'pointer' : 'default' }}
        >
          <GlobeView
            countries={countries}
            getCountryColor={getCountryColor}
            onCountryClick={handleCountryClick}
            onCountryHover={setHovered}
            globeRef={globeRef}
          />
        </Box>
      </Container>

      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md" className={styles.footerInner}>
          <Fade in={selected !== null} unmountOnExit>
            <Box className={styles.cardSlot}>
              {selected && (
                <InfoCard
                  view={view}
                  countryName={selected.properties.name}
                  data={info.data}
                  loading={info.loading}
                  notFound={info.notFound}
                  onClose={handleClose}
                  onToggleView={handleToggleView}
                />
              )}
            </Box>
          </Fade>
          {!selected && (
            <Typography
              variant="overline"
              color="text.secondary"
              className={styles.hint}
            >
              Hover a country, click to learn — click again to zoom into its capital
            </Typography>
          )}
        </Container>
      </Box>
    </>
  );
}
