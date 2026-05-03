import { Box, IconButton, Paper, Skeleton, Typography } from '@mui/material';
import type { CountryInfo } from '../../types';
import styles from './InfoCard.module.css';

export type AtlasView = 'country' | 'capital';

interface Props {
  view: AtlasView;
  countryName: string;
  data: CountryInfo | null;
  loading: boolean;
  notFound: boolean;
  onClose: () => void;
  onToggleView: () => void;
}

export default function InfoCard({
  view,
  countryName,
  data,
  loading,
  notFound,
  onClose,
  onToggleView,
}: Props) {
  return (
    <Paper
      elevation={0}
      role="region"
      aria-live="polite"
      className={styles.card}
      sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}
    >
      <Box className={styles.header}>
        <Typography
          variant="overline"
          className={styles.eyebrow}
          sx={{ color: 'text.secondary' }}
        >
          {view === 'country' ? 'Country' : 'Capital'}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close"
          className={styles.close}
          sx={{ color: 'text.secondary' }}
        >
          ✕
        </IconButton>
      </Box>

      {loading && <SkeletonBody />}

      {!loading && notFound && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We couldn't find details for{' '}
          <span className={styles.emphasis}>{countryName}</span>.
        </Typography>
      )}

      {!loading && !notFound && data && (
        <>
          {view === 'country' ? (
            <CountryBody data={data} />
          ) : (
            <CapitalBody data={data} />
          )}

          {data.capital && (
            <Typography
              variant="overline"
              role="button"
              tabIndex={0}
              onClick={onToggleView}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onToggleView();
              }}
              className={styles.toggle}
              sx={{ color: 'text.secondary' }}
            >
              {view === 'country'
                ? `↳  Zoom in to ${data.capital}`
                : `↰  Back to ${data.name}`}
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
}

function CountryBody({ data }: { data: CountryInfo }) {
  return (
    <>
      <Box className={styles.titleRow}>
        {data.flags?.svg && (
          <Box
            component="img"
            src={data.flags.svg}
            alt=""
            className={styles.flag}
            sx={{ borderColor: 'divider' }}
          />
        )}
        <Box className={styles.titleText}>
          <Typography variant="h2" component="h2" className={styles.title}>
            {data.name}
          </Typography>
          {data.nativeName && data.nativeName !== data.name && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {data.nativeName}
            </Typography>
          )}
        </Box>
      </Box>

      <Box className={styles.statsGrid}>
        <Stat label="Capital" value={data.capital ?? '—'} />
        <Stat
          label="Region"
          value={
            data.subregion
              ? `${data.region ?? ''}${data.region ? ' · ' : ''}${data.subregion}`
              : data.region ?? '—'
          }
        />
        <Stat label="Population" value={formatNumber(data.population)} />
        <Stat label="Area" value={formatArea(data.area)} />
      </Box>

      {(data.languages?.length || data.currencies?.length) && (
        <Box className={styles.tags}>
          {data.languages?.map((l) => (
            <Tag key={l.name} label={l.name} />
          ))}
          {data.currencies?.map((c) => (
            <Tag key={c.code} label={`${c.name}${c.symbol ? ` (${c.symbol})` : ''}`} />
          ))}
        </Box>
      )}
    </>
  );
}

function CapitalBody({ data }: { data: CountryInfo }) {
  return (
    <>
      <Box className={styles.titleRow}>
        <Box className={styles.titleText}>
          <Typography variant="h2" component="h2" className={styles.title}>
            {data.capital ?? '—'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Capital of <span className={styles.emphasis}>{data.name}</span>
          </Typography>
        </Box>
      </Box>

      <Box className={styles.statsGrid}>
        <Stat label="Region" value={data.subregion ?? data.region ?? '—'} />
        <Stat label="Timezone" value={data.timezones?.[0] ?? '—'} />
        <Stat
          label="Currency"
          value={
            data.currencies?.[0]
              ? `${data.currencies[0].code}${
                  data.currencies[0].symbol ? ` ${data.currencies[0].symbol}` : ''
                }`
              : '—'
          }
        />
        <Stat
          label="Calling code"
          value={data.callingCodes?.[0] ? `+${data.callingCodes[0]}` : '—'}
        />
      </Box>

      {data.languages?.length ? (
        <Box className={styles.tags}>
          {data.languages.map((l) => (
            <Tag key={l.name} label={l.nativeName ?? l.name} />
          ))}
        </Box>
      ) : null}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box className={styles.statBlock}>
      <Typography
        variant="overline"
        component="p"
        sx={{ color: 'text.secondary' }}
      >
        {label}
      </Typography>
      <Typography variant="body1" component="p" className={styles.statValue}>
        {value}
      </Typography>
    </Box>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <Box className={styles.tag} sx={{ borderColor: 'divider', color: 'text.secondary' }}>
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
}

function SkeletonBody() {
  return (
    <Box className={styles.skeletonBody}>
      <Skeleton variant="rectangular" width={56} height={36} />
      <Skeleton variant="text" width="60%" height={36} />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="80%" />
    </Box>
  );
}

function formatNumber(n?: number): string {
  if (n === undefined || n === null) return '—';
  return n.toLocaleString();
}

function formatArea(km2?: number): string {
  if (km2 === undefined || km2 === null) return '—';
  return `${km2.toLocaleString()} km²`;
}
