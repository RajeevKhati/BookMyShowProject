import { FileSearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CenteredShell, SurfaceCard } from "../components/layout";
import { UiButton } from "../components/ui";
import { theme as cinematicTheme } from "../styles/theme";

function NotFound() {
  const navigate = useNavigate();

  return (
    <CenteredShell className="px-6 py-12">
      <SurfaceCard className="max-w-lg text-center !py-12 sm:!py-14">
        <p
          className="m-0 text-6xl font-bold tracking-tight sm:text-7xl"
          style={{ color: cinematicTheme.colors.primary }}
          aria-hidden
        >
          404
        </p>
        <FileSearchOutlined
          className="mb-2 mt-4 text-5xl sm:text-6xl"
          style={{ color: cinematicTheme.colors.textSecondary }}
          aria-hidden
        />
        <h1 className="m-0 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Page not found
        </h1>
        <p
          className="mx-auto mt-4 mb-0 max-w-md text-base leading-relaxed"
          style={{ color: cinematicTheme.colors.textSecondary }}
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Head back home to keep browsing movies.
        </p>
        <UiButton
          variant="primary"
          size="large"
          shape="round"
          block
          className="mt-10"
          onClick={() => navigate("/")}
        >
          Back to home
        </UiButton>
      </SurfaceCard>
    </CenteredShell>
  );
}

export default NotFound;
