import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Button, Spin, message } from "antd";
import { axiosInstance } from "../../api";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const confirmBooking = async () => {
      const query = new URLSearchParams(location.search);
      const sessionId = query.get("session_id");

      if (!sessionId) {
        message.error("Missing session ID");
        return navigate("/error");
      }

      try {
        const response = await axiosInstance.post(
          "/api/booking/confirm-booking",
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setBookingSuccess(true);
        } else {
          navigate("/error");
        }
      } catch (err) {
        console.error(err);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    confirmBooking();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <Result
        status="success"
        title="Booking Successful!"
        subTitle="Your payment was successful and your seats have been booked."
        extra={[
          <Button type="primary" onClick={() => navigate("/")} key="home">
            Go Home
          </Button>,
        ]}
      />
    </div>
  );
};

export default SuccessPage;
