import { CloseCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CenteredShell, SurfaceCard } from "../../components/layout";
import { UiButton } from "../../components/ui";
import { theme as cinematicTheme } from "../../styles/theme";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <CenteredShell className="px-6 py-12">
      <SurfaceCard className="max-w-lg text-center !py-12 sm:!py-14">
        <CloseCircleFilled
          className="mb-6 text-6xl sm:text-[4.5rem]"
          style={{ color: cinematicTheme.colors.error }}
          aria-hidden
        />
        <h1 className="m-0 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Payment didn&apos;t go through
        </h1>
        <p
          className="mx-auto mt-4 mb-0 max-w-md text-base leading-relaxed"
          style={{ color: cinematicTheme.colors.textSecondary }}
        >
          Something interrupted checkout. Your card may not have been charged —
          please try again or pick another showtime.
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
};

export default ErrorPage;
