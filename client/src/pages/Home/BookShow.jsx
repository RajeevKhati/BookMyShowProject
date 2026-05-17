import { useEffect, useState } from "react";
import { getShowById } from "../../api/show";
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";
import { toast } from "../../feedback/toast";
import dayjs from "../../utils/dayjs";
import { axiosInstance } from "../../api";
import { PageHeading, SurfaceCard } from "../../components/layout";
import { UiButton } from "../../components/ui";
import { theme as cinematicTheme } from "../../styles/theme";
import { computeSeatGridLayout } from "../../utils/seatGridLayout";

const EMPTY_BOOKED_SEATS = [];

const BookShow = () => {
  const [show, setShow] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await getShowById({ showId: params.id });
      if (response.success) {
        setShow(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/booking/create-checkout-session",
        {
          selectedSeats,
          showId: show._id,
          ticketPrice: show.ticketPrice,
        },
      );
      window.location.href = response.data.url;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (!show) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const seatCapacity = Math.max(0, Number(show.totalSeats) || 0);
  const bookedSeatsArr = Array.isArray(show.bookedSeats)
    ? show.bookedSeats
    : EMPTY_BOOKED_SEATS;

  const renderSeatGrid = () => {
    if (seatCapacity === 0) {
      return (
        <p
          className="px-2 text-center text-sm"
          style={{ color: cinematicTheme.colors.textSecondary }}
        >
          Seat capacity for this show is not configured.
        </p>
      );
    }

    const { columns, rows } = computeSeatGridLayout(seatCapacity);
    const bookedSeatSet = new Set(
      bookedSeatsArr.map((s) => Number(s)),
    );

    return (
      <div className="flex flex-col items-center px-2">
        <div className="mx-auto mb-8 w-full max-w-[600px]">
          <p
            className="mb-3 text-center text-sm"
            style={{ color: cinematicTheme.colors.textSecondary }}
          >
            Screen this side — you'll be facing this direction
          </p>
          <div
            className="mx-auto h-2 w-3/4 rounded-full"
            style={{ backgroundColor: cinematicTheme.colors.elevated }}
          />
        </div>

        <div className="flex w-full justify-center px-2">
          <div className="flex flex-col items-center gap-2">
            {Array.from({ length: rows }, (_, rowIdx) => {
              const seatsThisRow = Math.min(
                columns,
                seatCapacity - rowIdx * columns,
              );
              if (seatsThisRow <= 0) return null;

              return (
                <div key={rowIdx} className="flex justify-center gap-2">
                  {Array.from({ length: seatsThisRow }, (_, i) => {
                    const seatNumber = rowIdx * columns + i + 1;

                    const booked = bookedSeatSet.has(seatNumber);
                    const selected = selectedSeats.includes(seatNumber);

                    let bg = cinematicTheme.colors.backgroundSecondary;
                    let border = "#444444";
                    let textCls = "text-white";

                    if (booked) {
                      bg = "#2a2a2a";
                      border = "#3d3d3d";
                      textCls = "text-[#808080]";
                    } else if (selected) {
                      bg = cinematicTheme.colors.success;
                      border = cinematicTheme.colors.success;
                      textCls = "text-[#0f0f0f]";
                    }

                    return (
                      <div key={seatNumber}>
                        <button
                          type="button"
                          disabled={booked}
                          className={`flex h-9 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${textCls} ${
                            booked
                              ? "cursor-not-allowed opacity-70"
                              : "cursor-pointer hover:brightness-110"
                          }`}
                          style={{ backgroundColor: bg, borderColor: border }}
                          onClick={() => {
                            if (booked) return;
                            if (selected) {
                              setSelectedSeats(
                                selectedSeats.filter((s) => s !== seatNumber),
                              );
                            } else {
                              setSelectedSeats([...selectedSeats, seatNumber]);
                            }
                          }}
                        >
                          {seatNumber}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="mx-auto mt-8 flex w-full max-w-[600px] flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: cinematicTheme.colors.elevated,
            backgroundColor: cinematicTheme.colors.backgroundSecondary,
          }}
        >
          <div className="min-w-0 flex-1">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-[#808080]">
              Selected seats
            </p>
            <p className="mt-1 mb-0 truncate text-base font-semibold text-white">
              {selectedSeats.length ? selectedSeats.join(", ") : "None yet"}
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-[#808080]">
              Total
            </p>
            <p className="mt-1 mb-0 text-xl font-bold tabular-nums text-white">
              ₹{selectedSeats.length * show.ticketPrice}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <UiButton variant="secondary" size="middle" onClick={() => navigate(-1)}>
        ← Back to movie
      </UiButton>

      <SurfaceCard className="!overflow-x-visible !overflow-y-visible !p-0">
        <div
          className="border-b px-6 py-6 sm:px-8"
          style={{ borderColor: cinematicTheme.colors.elevated }}
        >
          <PageHeading
            align="left"
            eyebrow="Checkout"
            title={show.movie.movieName}
            subtitle={`${show.theatre.name} · ${show.theatre.address}`}
          />
          <dl className="m-0 mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#808080]">
                Show
              </dt>
              <dd className="mt-1 mb-0 font-semibold text-white">
                {show.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#808080]">
                Date &amp; time
              </dt>
              <dd className="mt-1 mb-0 font-semibold text-white">
                {dayjs(show.date).format("MMM Do YYYY")} ·{" "}
                {dayjs(show.time, "HH:mm").format("hh:mm A")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#808080]">
                Ticket price
              </dt>
              <dd className="mt-1 mb-0 font-semibold text-white">
                ₹{show.ticketPrice} each
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#808080]">
                Seats
              </dt>
              <dd className="mt-1 mb-0 font-semibold text-white">
                {seatCapacity - bookedSeatsArr.length} available ·{" "}
                {bookedSeatsArr.length} booked
              </dd>
            </div>
          </dl>
        </div>

        <div className="px-4 py-8 sm:px-8">{renderSeatGrid()}</div>

        {selectedSeats.length > 0 ? (
          <div
            className="border-t px-6 py-6 sm:px-8"
            style={{
              borderColor: cinematicTheme.colors.elevated,
              backgroundColor: cinematicTheme.colors.backgroundSecondary,
            }}
          >
            <UiButton
              variant="primary"
              block
              size="large"
              shape="round"
              onClick={handleCheckout}
            >
              Pay now
            </UiButton>
          </div>
        ) : null}
      </SurfaceCard>
    </div>
  );
};

export default BookShow;
