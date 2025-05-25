// pages/ErrorPage.jsx
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <Result
        status="error"
        title="Payment Failed"
        subTitle="Something went wrong with your payment. Please try again."
        extra={[
          <Button type="primary" onClick={() => navigate("/")}>
            Try Again
          </Button>,
        ]}
      />
    </div>
  );
};

export default ErrorPage;
