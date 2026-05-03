import { useRef, useEffect, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { useTheme } from '@mui/material/styles';
import type { CountryFeature } from '../../types';
import styles from './GlobeView.module.css';

interface Props {
  countries: CountryFeature[];
  getCountryColor: (feature: CountryFeature) => string;
  onCountryClick: (feature: CountryFeature) => void;
  onCountryHover?: (feature: CountryFeature | null) => void;
  globeRef?: React.MutableRefObject<GlobeMethods | undefined>;
}

export default function GlobeView({
  countries,
  getCountryColor,
  onCountryClick,
  onCountryHover,
  globeRef,
}: Props) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const next = Math.min(width, height || window.innerHeight * 0.6);
      if (next > 0) setSize(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <Globe
        ref={globeRef}
        width={size}
        height={size}
        backgroundColor="rgba(0,0,0,0)"
        showGlobe
        showAtmosphere
        atmosphereColor={theme.palette.secondary.main}
        atmosphereAltitude={0.18}
        globeMaterial={
          {
            color: '#ffffff',
            opacity: 0.95,
            transparent: true,
            dispose: () => {},
          } as never
        }
        polygonsData={countries}
        polygonCapColor={(feat: object) => getCountryColor(feat as CountryFeature)}
        polygonSideColor={() => 'rgba(26, 26, 26, 0.04)'}
        polygonStrokeColor={() => 'rgba(26, 26, 26, 0.45)'}
        polygonAltitude={0.005}
        onPolygonClick={(feat: object) => onCountryClick(feat as CountryFeature)}
        onPolygonHover={
          onCountryHover
            ? (feat: object | null) => onCountryHover(feat as CountryFeature | null)
            : undefined
        }
      />
    </div>
  );
}
