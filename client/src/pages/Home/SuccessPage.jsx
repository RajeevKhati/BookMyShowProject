// pages/SuccessPage.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Result, Button } from "antd";
import { axiosInstance } from "../../api";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const show = query.get("show");
    const seats = query.get("seats")?.split(",");

    const bookShow = async () => {
      await axiosInstance.post(
        "/api/booking/book-show",
        {
          show,
          seats,
          user: JSON.parse(localStorage.getItem("user"))._id,
        }
      );
    };

    if (show && seats.length) bookShow();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <Result
        status="success"
        title="Booking Successful!"
        subTitle="Your payment was successful and seats have been booked."
        extra={[
          <Button type="primary" onClick={() => navigate("/")}>
            Go Home
          </Button>,
        ]}
      />
    </div>
  );
};

export default SuccessPage;
