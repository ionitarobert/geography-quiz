import {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { useTheme } from "@mui/material/styles";
import { MeshPhongMaterial } from "three";
import type { CountryFeature } from "../../types";
import styles from "./GlobeView.module.css";

const MAX_PIXEL_RATIO = 1.5;

const DEFAULT_ALTITUDE = 2.0;

const RENDERER_CONFIG = {
  antialias: false,
  powerPreference: "high-performance" as const,
};

interface Props {
  countries: CountryFeature[];
  getCountryColor: (feature: CountryFeature) => string;
  onCountryClick: (feature: CountryFeature) => void;
  onCountryHover?: (feature: CountryFeature | null) => void;
  globeRef?: React.MutableRefObject<GlobeMethods | undefined>;
  initialAltitude?: number;
}

function measure(el: HTMLElement): number {
  const { width, height } = el.getBoundingClientRect();
  return Math.floor(Math.min(width, height || window.innerHeight * 0.6));
}

export default function GlobeView({
  countries,
  getCountryColor,
  onCountryClick,
  onCountryHover,
  globeRef,
  initialAltitude = DEFAULT_ALTITUDE,
}: Props) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<GlobeMethods | undefined>(undefined);
  const ref = globeRef ?? internalRef;
  const [size, setSize] = useState(0);
  const globeMaterial = useMemo(
    () => new MeshPhongMaterial({ color: "#b8c8d0a6" }),
    [],
  );

  const freezeMeshes = useCallback(() => {
    const globe = ref.current;
    if (!globe) return;
    globe.scene().traverse((obj) => {
      if ((obj as { isMesh?: boolean }).isMesh && obj.matrixAutoUpdate) {
        obj.matrixAutoUpdate = false;
        obj.updateMatrix();
      }
    });
  }, [ref]);

  const handleReady = useCallback(() => {
    const globe = ref.current;
    if (!globe) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    globe.renderer().setPixelRatio(dpr);

    freezeMeshes();
    globe.pointOfView({ altitude: initialAltitude });
  }, [ref, initialAltitude, freezeMeshes]);

  useEffect(() => {
    if (!countries.length) return;
    const id = requestAnimationFrame(freezeMeshes);
    return () => cancelAnimationFrame(id);
  }, [countries, freezeMeshes]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const next = measure(el);
    if (next > 0) setSize(next);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const next = measure(el);
      if (next > 0) setSize(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {size > 0 && (
        <Globe
          ref={ref}
          width={size}
          height={size}
          rendererConfig={RENDERER_CONFIG}
          onGlobeReady={handleReady}
          backgroundColor="rgba(0,0,0,0)"
          showGlobe
          showAtmosphere
          atmosphereColor={theme.palette.secondary.main}
          atmosphereAltitude={0.18}
          globeMaterial={globeMaterial}
          polygonsData={countries}
          polygonsTransitionDuration={0}
          polygonCapColor={(feat: object) =>
            getCountryColor(feat as CountryFeature)
          }
          polygonSideColor={() => "rgba(26, 26, 26, 0.04)"}
          polygonStrokeColor={() => "rgba(26, 26, 26, 0.45)"}
          polygonAltitude={0.005}
          onPolygonClick={(feat: object) =>
            onCountryClick(feat as CountryFeature)
          }
          onPolygonHover={
            onCountryHover
              ? (feat: object | null) =>
                  onCountryHover(feat as CountryFeature | null)
              : undefined
          }
        />
      )}
    </div>
  );
}
