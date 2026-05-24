import { Box, Button, Container, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./HeaderBar.module.css";

export default function HeaderBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onQuiz = pathname.startsWith("/quiz");
  const onAtlas = pathname === "/atlas";

  return (
    <Container maxWidth="lg" className={styles.headerBar}>
      <Box className={styles.row} sx={{ color: "text.secondary" }}>
        <Box className={styles.side} aria-hidden />
        <Box className={styles.crumbs}>
          <Typography variant="overline">Atlas</Typography>
          <Typography variant="overline" sx={{ color: "text.disabled" }}>
            /
          </Typography>
          <Typography variant="overline">{routeLabel(pathname)}</Typography>
        </Box>
        <Box className={styles.side}>
          {onQuiz && (
            <Button
              size="small"
              onClick={() => navigate("/")}
              className={styles.actionButton}
              sx={{ color: "text.secondary" }}
            >
              Menu
            </Button>
          )}
          {onAtlas && (
            <Button
              size="small"
              onClick={() => navigate("/")}
              className={styles.actionButton}
              sx={{ color: "text.secondary" }}
            >
              Exit
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}

function routeLabel(pathname: string): string {
  if (pathname === "/") return "Welcome";
  if (pathname === "/select") return "Setup";
  if (pathname.startsWith("/quiz")) return "Quiz";
  if (pathname === "/result") return "Score";
  if (pathname === "/atlas") return "Explore";
  return "";
}
