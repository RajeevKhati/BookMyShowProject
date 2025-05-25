import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getShowById } from "../../api/show";
import { useNavigate, useParams } from "react-router-dom";
import { message, Card, Row, Col, Button } from "antd";
import moment from "moment";
import { axiosInstance } from "../../api";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RSeSvD7vcBE3xveQHdFSaDYunxnuDH01SvxmcYe46l8Y041kwLDfwOVjUq4VG2QiLcTxwPYdaoAK7ielS37AdRy00u87GLFD7"
); // your publishable key

const BookShow = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [show, setShow] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getShowById({ showId: params.id });
      if (response.success) {
        setShow(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const getSeats = () => {
    const columns = 12;
    const totalSeats = 120;
    const rows = totalSeats / columns;

    return (
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[600px] mx-auto mb-6">
          <p className="text-center mb-2 text-sm text-gray-600">
            Screen this side, you will be watching in this direction
          </p>
          <div className="h-2 w-3/4 mx-auto bg-gray-200 rounded-sm"></div>
        </div>

        <ul className="flex flex-wrap justify-center gap-2 max-w-[600px]">
          {Array.from(Array(rows).keys()).map((row) =>
            Array.from(Array(columns).keys()).map((column) => {
              const seatNumber = row * columns + column + 1;
              if (seatNumber > totalSeats) return null;

              let baseClasses =
                "w-10 h-9 text-sm flex items-center justify-center border rounded cursor-pointer";
              let seatClasses = "bg-gray-100 border-gray-400 hover:bg-gray-200";
              if (selectedSeats.includes(seatNumber))
                seatClasses = "bg-green-600 border-green-600 text-white";
              if (show?.bookedSeats.includes(seatNumber))
                seatClasses =
                  "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed";

              return (
                <li key={seatNumber}>
                  <button
                    className={`${baseClasses} ${seatClasses}`}
                    onClick={() => {
                      if (show.bookedSeats.includes(seatNumber)) return;
                      if (selectedSeats.includes(seatNumber)) {
                        setSelectedSeats(
                          selectedSeats.filter((s) => s !== seatNumber)
                        );
                      } else {
                        setSelectedSeats([...selectedSeats, seatNumber]);
                      }
                    }}
                  >
                    {seatNumber}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex justify-between items-center w-full max-w-[600px] mx-auto mt-4 mb-6 p-4 border rounded">
          <div className="flex-1">
            Selected Seats:{" "}
            <span className="font-semibold">{selectedSeats.join(", ")}</span>
          </div>
          <div className="ml-4 whitespace-nowrap">
            Total Price:{" "}
            <span className="font-semibold text-lg">
              Rs. {selectedSeats.length * show.ticketPrice}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const handleCheckout = async () => {
    // const stripe = await stripePromise;

    // const response = await axiosInstance.post(
    //   "http://localhost:4242/create-checkout-session"
    // );

    // const session = await response.json();

    // const result = await stripe.redirectToCheckout({
    //   sessionId: session.id,
    // });

    // if (result.error) {
    //   console.error(result.error.message);
    // }

    try {
      const response = await axiosInstance.post(
        "/api/booking/create-checkout-session",
        {
          selectedSeats,
          showId: show._id,
          ticketPrice: show.ticketPrice,
        }
      );
      window.location.href = response.data.url;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div className="mb-4">
                  <h1 className="text-2xl font-bold mb-1">
                    {show.movie.title}
                  </h1>
                  <p className="text-gray-600">
                    Theatre: {show.theatre.name}, {show.theatre.address}
                  </p>
                </div>
              }
              extra={
                <div className="space-y-1 text-right">
                  <h3 className="text-base">
                    <span className="font-medium text-gray-600">
                      Show Name:
                    </span>{" "}
                    {show.name}
                  </h3>
                  <h3 className="text-base">
                    <span className="font-medium text-gray-600">
                      Date & Time:
                    </span>{" "}
                    {moment(show.date).format("MMM Do YYYY")} at{" "}
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </h3>
                  <h3 className="text-base">
                    <span className="font-medium text-gray-600">
                      Ticket Price:
                    </span>{" "}
                    Rs. {show.ticketPrice}/-
                  </h3>
                  <h3 className="text-base">
                    <span className="font-medium text-gray-600">
                      Total Seats:
                    </span>{" "}
                    {show.totalSeats}
                    <span className="text-gray-600">
                      {" "}
                      &nbsp;|&nbsp; Available Seats:
                    </span>{" "}
                    {show.totalSeats - show.bookedSeats.length}
                  </h3>
                </div>
              }
              style={{ width: "100%" }}
            >
              {getSeats()}
              {selectedSeats.length > 0 && (
                <div className="max-width-600 mx-auto">
                  <Button
                    onClick={handleCheckout}
                    type="primary"
                    shape="round"
                    size="large"
                    block
                  >
                    Pay Now
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default BookShow;
