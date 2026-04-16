import { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import type { CountryFeature, FeedbackState } from '../../types';

interface Props {
  countries: CountryFeature[];
  target: CountryFeature | null;
  lastClicked: CountryFeature | null;
  feedback: FeedbackState;
  onCountryClick: (feature: CountryFeature) => void;
}

export default function GlobeView({ countries, target, lastClicked, feedback, onCountryClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setSize(Math.min(width, window.innerHeight * 0.75));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const polygonColor = (feat: object): string => {
    const f = feat as CountryFeature;
    if (f === lastClicked && feedback === 'correct') return 'rgba(0,200,80,0.85)';
    if (f === lastClicked && feedback === 'wrong') return 'rgba(220,50,50,0.85)';
    if (f === target) return 'rgba(255,215,0,0.5)';
    return 'rgba(80,140,200,0.25)';
  };

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <Globe
        width={size}
        height={size}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={countries}
        polygonCapColor={polygonColor}
        polygonSideColor={() => 'rgba(0,60,100,0.4)'}
        polygonStrokeColor={() => '#224'}
        polygonLabel={(feat: object) => (feat as CountryFeature).properties.name}
        onPolygonClick={(feat: object) => onCountryClick(feat as CountryFeature)}
      />
    </div>
  );
}
