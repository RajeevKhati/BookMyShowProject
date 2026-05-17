import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { toast } from "../../feedback/toast";
import { axiosInstance } from "../../api";
import { CenteredShell, SurfaceCard } from "../../components/layout";
import { UiButton } from "../../components/ui";
import { theme as cinematicTheme } from "../../styles/theme";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  /** pending | confirmed | leaving */
  const [phase, setPhase] = useState("pending");

  useEffect(() => {
    const confirmBooking = async () => {
      const query = new URLSearchParams(location.search);
      const sessionId = query.get("session_id");

      if (!sessionId) {
        toast.error("Missing session ID");
        setPhase("leaving");
        navigate("/error");
        return;
      }

      try {
        const response = await axiosInstance.post(
          "/api/booking/confirm-booking",
          { sessionId },
        );
        if (response.data.success) {
          setPhase("confirmed");
        } else {
          setPhase("leaving");
          navigate("/error");
        }
      } catch (err) {
        console.error(err);
        setPhase("leaving");
        navigate("/error");
      }
    };

    confirmBooking();
  }, [location, navigate]);

  if (phase === "pending") {
    return (
      <CenteredShell>
        <SurfaceCard className="flex min-h-[200px] items-center justify-center !py-16">
          <Spin size="large" />
        </SurfaceCard>
      </CenteredShell>
    );
  }

  if (phase === "leaving") {
    return (
      <CenteredShell>
        <SurfaceCard className="flex min-h-[200px] items-center justify-center !py-16">
          <Spin size="large" />
        </SurfaceCard>
      </CenteredShell>
    );
  }

  return (
    <CenteredShell className="px-6 py-12">
      <SurfaceCard className="max-w-lg text-center !py-12 sm:!py-14">
        <CheckCircleFilled
          className="mb-6 text-6xl sm:text-[4.5rem]"
          style={{ color: cinematicTheme.colors.success }}
          aria-hidden
        />
        <h1 className="m-0 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Booking confirmed
        </h1>
        <p
          className="mx-auto mt-4 mb-0 max-w-md text-base leading-relaxed"
          style={{ color: cinematicTheme.colors.textSecondary }}
        >
          Payment succeeded and your seats are reserved. Check your email for the
          receipt.
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

export default SuccessPage;
