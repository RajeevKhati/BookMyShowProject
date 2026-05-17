import {
  Avatar,
  Divider,
  Empty,
  Skeleton,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMyBookings } from "../../api/booking";
import { SurfaceCard } from "../../components/layout";
import { theme as cinematicTheme } from "../../styles/theme";

const { Title, Text } = Typography;

const INR_FORMAT = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function capitalizeRole(role) {
  if (role == null || role === "") return "—";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function initialsFromName(name) {
  if (name == null || String(name).trim() === "") return "?";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const a = parts[0][0] ?? "";
  const b = parts[parts.length - 1][0] ?? "";
  return `${a}${b}`.toUpperCase();
}

function formatSeatList(seats) {
  if (!Array.isArray(seats) || seats.length === 0) return "—";
  return [...seats]
    .map((s) => (typeof s === "number" ? s : String(s)))
    .sort((x, y) => Number(x) - Number(y))
    .join(", ");
}

/** Keep header labels on one line inside scrollable tables */
function theadLabel(text) {
  return (
    <span className="whitespace-nowrap" style={{ paddingRight: 8 }}>
      {text}
    </span>
  );
}

function Profile() {
  const { user } = useSelector((state) => state.user);

  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const loadBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const res = await getMyBookings();
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch {
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const stats = useMemo(() => {
    const count = bookings.length;
    const tickets = bookings.reduce(
      (sum, b) => sum + (Array.isArray(b.seats) ? b.seats.length : 0),
      0,
    );
    const spend = bookings.reduce((sum, b) => {
      const seats = Array.isArray(b.seats) ? b.seats.length : 0;
      const price = b.show?.ticketPrice ?? 0;
      return sum + seats * price;
    }, 0);
    return { count, tickets, spend };
  }, [bookings]);

  const heroInitials = useMemo(() => initialsFromName(user?.name), [user?.name]);

  /** Min table width → horizontal scroll on narrow layouts; avoids header wrap */
  const tableScrollX = 1180;

  const tableColumns = useMemo(
    () => [
      {
        title: theadLabel("Movie"),
        key: "movie",
        minWidth: 260,
        render: (_, record) => {
          const movie = record.show?.movie;
          const poster = movie?.poster;
          const name = movie?.movieName ?? "Show";
          const movieId = movie?._id ? String(movie._id) : null;
          const showDate = record.show?.date;

          const showDateMoment = moment(showDate);
          const dateQuery = showDateMoment.isValid()
            ? showDateMoment.format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD");

          const content = movieId ? (
            <Link
              to={`/movie/${movieId}?date=${dateQuery}`}
              style={{ color: cinematicTheme.colors.text }}
              className="font-semibold no-underline hover:underline"
            >
              {name}
            </Link>
          ) : (
            <span>{name}</span>
          );

          return (
            <div className="flex max-w-[220px] items-center gap-3">
              <div
                className="h-12 w-9 shrink-0 overflow-hidden rounded-md"
                aria-hidden="true"
                style={{ background: cinematicTheme.colors.background }}
              >
                {poster ? (
                  <img
                    src={poster}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <div
                    className="flex size-full items-center justify-center text-[10px]"
                    style={{ color: cinematicTheme.colors.muted }}
                  >
                    —
                  </div>
                )}
              </div>
              <span className="min-w-0 truncate">{content}</span>
            </div>
          );
        },
      },
      {
        title: theadLabel("Theatre"),
        key: "theatre",
        minWidth: 140,
        ellipsis: true,
        render: (_, record) =>
          record.show?.theatre?.name ?? (
            <Text type="secondary">Unavailable</Text>
          ),
      },
      {
        title: theadLabel("Show"),
        key: "when",
        width: 150,
        render: (_, record) => {
          const d = record.show?.date;
          const time = record.show?.time ?? "—";
          if (!record.show || !d) return "—";
          return (
            <span>
              {moment(d).format("ddd, MMM D, YYYY")}
              <br />
              <Text type="secondary">{time}</Text>
            </span>
          );
        },
      },
      {
        title: theadLabel("Seats"),
        key: "seats",
        width: 128,
        render: (_, record) => {
          const text = formatSeatList(record.seats);
          const short =
            text.length > 28 ? `${text.slice(0, 28)}…` : text;
          return (
            <Tooltip title={text}>
              <span className="font-mono text-xs">{short}</span>
            </Tooltip>
          );
        },
      },
      {
        title: theadLabel("Paid"),
        key: "paid",
        width: 132,
        render: (_, record) => {
          const n = Array.isArray(record.seats) ? record.seats.length : 0;
          const price = record.show?.ticketPrice;
          if (!record.show || n < 1 || price == null) return "—";
          const line = INR_FORMAT.format(n * price);
          return (
            <Tooltip title={`${INR_FORMAT.format(price)} × ${n}`}>
              <span className="whitespace-nowrap">{line}</span>
            </Tooltip>
          );
        },
      },
      {
        title: theadLabel("Booked"),
        key: "created",
        width: 124,
        render: (_, record) =>
          record.createdAt
            ? moment(record.createdAt).format("MMM D, YYYY")
            : "—",
      },
      {
        title: theadLabel("Transaction ID"),
        key: "transactionId",
        width: 158,
        render: (_, record) =>
          record.transactionId ? (
            <Tooltip title={record.transactionId}>
              <Tag
                className="m-0 max-w-[5rem] cursor-default truncate"
                style={{
                  borderColor: cinematicTheme.colors.elevated,
                  color: cinematicTheme.colors.textSecondary,
                }}
              >
                …{record.transactionId.slice(-8)}
              </Tag>
            </Tooltip>
          ) : (
            "—"
          ),
      },
    ],
    [],
  );

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <SurfaceCard className="!mb-6 !text-left">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <Avatar
            size={104}
            className="flex shrink-0 items-center justify-center text-2xl font-semibold uppercase"
            style={{
              backgroundColor: cinematicTheme.colors.primary,
              color: cinematicTheme.colors.text,
              border: `3px solid ${cinematicTheme.colors.elevated}`,
            }}
          >
            {heroInitials}
          </Avatar>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <Title
              level={3}
              className="!mb-1 !mt-0 !text-[1.65rem]"
              style={{ color: cinematicTheme.colors.text }}
            >
              {user?.name ?? "Your profile"}
            </Title>
            <Text type="secondary" className="block text-base">
              {user?.email}
            </Text>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Tag
                bordered={false}
                style={{
                  margin: 0,
                  padding: "4px 10px",
                  background: cinematicTheme.colors.elevated,
                  color: cinematicTheme.colors.textSecondary,
                }}
              >
                {capitalizeRole(user?.role)}
              </Tag>
              <Tag
                icon={<CalendarOutlined />}
                bordered={false}
                style={{
                  margin: 0,
                  background: cinematicTheme.colors.backgroundSecondary,
                  color: cinematicTheme.colors.text,
                }}
              >
                {stats.count} bookings
              </Tag>
              <Tag
                icon={<TeamOutlined />}
                bordered={false}
                style={{
                  margin: 0,
                  background: cinematicTheme.colors.backgroundSecondary,
                  color: cinematicTheme.colors.text,
                }}
              >
                {stats.tickets} tickets
              </Tag>
              {stats.count > 0 ? (
                <Tag
                  icon={<EnvironmentOutlined />}
                  bordered={false}
                  style={{
                    margin: 0,
                    background: cinematicTheme.colors.backgroundSecondary,
                    color: cinematicTheme.colors.primary,
                  }}
                >
                  {INR_FORMAT.format(stats.spend)} spent
                </Tag>
              ) : null}
            </div>
          </div>
        </div>

        <Divider
          plain
          className="!my-8"
          style={{
            borderColor: cinematicTheme.colors.elevated,
            color: cinematicTheme.colors.muted,
          }}
        />

        <div>
          <Text strong style={{ color: cinematicTheme.colors.textSecondary }}>
            Account
          </Text>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span style={{ color: cinematicTheme.colors.muted }}>
                Screen name:
              </span>
              <span style={{ color: cinematicTheme.colors.text }}>
                {user?.name ?? "—"}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span style={{ color: cinematicTheme.colors.muted }}>
                Signed in as:
              </span>
              <span style={{ color: cinematicTheme.colors.text }}>
                {user?.email ?? "—"}
              </span>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="!text-left">
        <Title
          level={4}
          className="!mb-1 !mt-0 !text-lg"
          style={{ color: cinematicTheme.colors.text }}
        >
          Your bookings
        </Title>
        <Text type="secondary" className="mb-5 block">
          Reservations linked to your CineVault account. Tap a title to revisit
          the movie page.
        </Text>

        {bookingsLoading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : bookings.length === 0 ? (
          <Empty
            styles={{
              root: { marginBlock: "1.25rem" },
              description: {
                maxWidth: 360,
                color: cinematicTheme.colors.textSecondary,
              },
            }}
            description={
              <span>
                You haven&apos;t booked a screening yet — explore titles and pick
                your seats anytime.{" "}
                <Link
                  to="/"
                  className="font-semibold no-underline"
                  style={{ color: cinematicTheme.colors.primary }}
                >
                  Browse movies
                </Link>
              </span>
            }
          />
        ) : (
          <div className="min-w-0 w-full overflow-x-auto pb-1">
            <Table
              size="middle"
              rowKey={(r) => r._id}
              pagination={
                bookings.length > 8
                  ? { pageSize: 8, hideOnSinglePage: true }
                  : false
              }
              scroll={{ x: tableScrollX }}
              columns={tableColumns}
              dataSource={bookings}
            />
          </div>
        )}
      </SurfaceCard>
    </div>
  );
}

export default Profile;
