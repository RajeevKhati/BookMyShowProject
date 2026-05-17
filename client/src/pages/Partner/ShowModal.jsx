import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Tag,
  TimePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllMovies } from "../../api/movie";
import {
  addShow,
  deleteShow,
  getShowsByTheatre,
  updateShow,
} from "../../api/show";
import { toast } from "../../feedback/toast";
import { UiButton } from "../../components/ui";
import { theme as cinematicTheme } from "../../styles/theme";

dayjs.extend(customParseFormat);

const { Text, Title } = Typography;

/** Browse screenings vs dedicated schedule/edit panel — avoids one overloaded modal view. */
function ShowModal({
  isShowModalOpen,
  setIsShowModalOpen,
  selectedTheatre,
}) {
  const [panel, setPanel] = useState("list");
  const [scheduleMode, setScheduleMode] = useState("create");
  const [editingShow, setEditingShow] = useState(null);
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCatalogAndShows = useCallback(async () => {
    if (!selectedTheatre?._id) return;
    setLoading(true);
    try {
      const movieResponse = await getAllMovies();
      if (movieResponse?.success && Array.isArray(movieResponse.data)) {
        setMovies(movieResponse.data);
      } else if (Array.isArray(movieResponse?.data)) {
        setMovies(movieResponse.data);
      } else {
        setMovies([]);
        if (movieResponse?.success === false && movieResponse?.message) {
          toast.error(movieResponse.message);
        }
      }

      const showResponse = await getShowsByTheatre({
        theatreId: selectedTheatre._id,
      });
      if (showResponse.success && Array.isArray(showResponse.data)) {
        setShows(showResponse.data);
      } else {
        setShows([]);
        if (showResponse?.success === false && showResponse?.message) {
          toast.error(showResponse.message);
        }
      }
    } catch (err) {
      toast.error(err?.message || "Could not load shows.");
      setShows([]);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTheatre?._id]);

  useEffect(() => {
    if (!isShowModalOpen || !selectedTheatre) return;
    setPanel("list");
    setEditingShow(null);
    setScheduleMode("create");
    fetchCatalogAndShows();
  }, [isShowModalOpen, selectedTheatre, fetchCatalogAndShows]);

  const handleClose = () => {
    setIsShowModalOpen(false);
    setPanel("list");
    setEditingShow(null);
  };

  const openCreate = () => {
    setScheduleMode("create");
    setEditingShow(null);
    setPanel("form");
  };

  const openEdit = (record) => {
    setScheduleMode("edit");
    setEditingShow(record);
    setPanel("form");
  };

  const backToList = () => {
    setPanel("list");
    setEditingShow(null);
  };

  const handleDelete = useCallback(
    async (showId) => {
      try {
        const response = await deleteShow({ showId });
        if (response.success) {
          toast.success(response.message);
          fetchCatalogAndShows();
        }
      } catch {
        /* interceptors */
      }
    },
    [fetchCatalogAndShows],
  );

  const formInitialValues = useMemo(() => {
    if (scheduleMode !== "edit" || !editingShow) return undefined;
    const timeRaw = editingShow.time;
    const timeParsed =
      typeof timeRaw === "string"
        ? dayjs(timeRaw, "HH:mm")
        : dayjs(timeRaw);
    return {
      name: editingShow.name,
      date: dayjs(editingShow.date),
      time: timeParsed.isValid() ? timeParsed : undefined,
      movie: editingShow.movie?._id,
      ticketPrice: editingShow.ticketPrice,
      totalSeats: editingShow.totalSeats,
    };
  }, [scheduleMode, editingShow]);

  const formKey = `${scheduleMode}-${editingShow?._id ?? "new"}`;

  const onFinishSchedule = async (values) => {
    try {
      const payload = {
        name: values.name,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm"),
        movie: values.movie,
        ticketPrice: Number(values.ticketPrice),
        totalSeats: Number(values.totalSeats),
        theatre: selectedTheatre._id,
      };

      let response = null;
      if (scheduleMode === "create") {
        response = await addShow(payload);
      } else {
        response = await updateShow({
          ...payload,
          showId: editingShow._id,
        });
      }

      if (response?.success) {
        toast.success(response.message);
        await fetchCatalogAndShows();
        backToList();
      }
    } catch {
      /* interceptors */
    }
  };

  const columns = [
      {
        title: "Show",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        render: (text) => (
          <span className="font-semibold text-white">{text}</span>
        ),
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 132,
        render: (text) =>
          text ? moment(text).format("MMM D, YYYY") : "—",
      },
      {
        title: "Time",
        dataIndex: "time",
        key: "time",
        width: 100,
        render: (text) =>
          text ? moment(text, "HH:mm").format("hh:mm A") : "—",
      },
      {
        title: "Movie",
        key: "movie",
        ellipsis: true,
        render: (_, row) => row.movie?.movieName ?? "—",
      },
      {
        title: "Price",
        dataIndex: "ticketPrice",
        key: "ticketPrice",
        width: 88,
      },
      {
        title: "Seats",
        key: "seats",
        width: 88,
        render: (_, row) => row.totalSeats ?? "—",
      },
      {
        title: "Available",
        key: "avail",
        width: 96,
        render: (_, row) => {
          const booked = Array.isArray(row.bookedSeats)
            ? row.bookedSeats.length
            : 0;
          const total = row.totalSeats ?? 0;
          return Math.max(0, total - booked);
        },
      },
      {
        title: "Actions",
        key: "actions",
        width: 140,
        fixed: "right",
        render: (_, row) => (
          <div className="flex flex-wrap gap-2">
            <UiButton
              variant="secondary"
              size="middle"
              icon={<EditOutlined />}
              aria-label={`Edit ${row.name}`}
              onClick={() => openEdit(row)}
            />
            <Popconfirm
              title="Remove this screening?"
              description="Customers will no longer see this showtime."
              okText="Remove"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(row._id)}
            >
              <UiButton
                variant="secondary"
                danger
                size="middle"
                icon={<DeleteOutlined />}
                aria-label={`Delete ${row.name}`}
              />
            </Popconfirm>
          </div>
        ),
      },
    ];

  const modalTitle = (
    <div className="pr-8">
      <div className="flex flex-wrap items-center gap-2">
        <CalendarOutlined style={{ color: cinematicTheme.colors.primary }} />
        <span className="text-lg font-semibold text-white">
          {selectedTheatre?.name}
        </span>
        <Tag
          className="!m-0 border-0 text-xs font-semibold uppercase tracking-wide"
          style={{
            background: cinematicTheme.colors.elevated,
            color: cinematicTheme.colors.textSecondary,
          }}
        >
          Screenings
        </Tag>
      </div>
      {selectedTheatre?.address ? (
        <Text type="secondary" className="mt-1 block text-sm">
          {selectedTheatre.address}
        </Text>
      ) : null}
    </div>
  );

  const disablePastDates =
    scheduleMode === "create"
      ? (current) =>
          current && current < dayjs().startOf("day")
      : undefined;

  return (
    <Modal
      centered
      destroyOnClose
      title={modalTitle}
      open={isShowModalOpen}
      onCancel={handleClose}
      width={1080}
      footer={null}
      classNames={{ body: "!max-h-[min(82vh,760px)] !overflow-y-auto !pt-2" }}
    >
      {panel === "list" ? (
        <>
          <div className="mb-6 flex flex-col gap-3 border-b border-[#2a2a2a] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Title level={5} className="!mb-1 !mt-0 !text-white">
                Scheduled shows
              </Title>
              <Text type="secondary" className="text-sm">
                Review what&apos;s live, then add or edit screenings.
              </Text>
            </div>
            <UiButton
              variant="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={openCreate}
            >
              Schedule new show
            </UiButton>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spin size="large" />
            </div>
          ) : (
            <div className="min-w-0 overflow-x-auto">
              <Table
                dataSource={shows}
                columns={columns}
                rowKey={(row) => row._id}
                scroll={{ x: 900 }}
                pagination={
                  shows.length > 8
                    ? { pageSize: 8, showSizeChanger: false }
                    : false
                }
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      styles={{
                        description: {
                          color: cinematicTheme.colors.textSecondary,
                        },
                      }}
                      description="No showtimes yet. Use “Schedule new show” to publish your first screening."
                    />
                  ),
                }}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] pb-4">
            <UiButton
              variant="secondary"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={backToList}
            >
              Back to list
            </UiButton>
            <Title level={5} className="!mb-0 !text-white">
              {scheduleMode === "create"
                ? "Schedule new show"
                : "Edit screening"}
            </Title>
          </div>

          {loading && movies.length === 0 ? (
            <div className="flex justify-center py-12">
              <Spin />
            </div>
          ) : (
            <Form
              key={formKey}
              layout="vertical"
              initialValues={formInitialValues}
              onFinish={onFinishSchedule}
              requiredMark={false}
            >
              <Row gutter={[16, 8]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Show name"
                    name="name"
                    rules={[{ required: true, message: "Show name is required" }]}
                  >
                    <Input
                      size="large"
                      placeholder="e.g. Evening show"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: "Date is required" }]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full"
                      format="YYYY-MM-DD"
                      disabledDate={disablePastDates}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Start time"
                    name="time"
                    rules={[{ required: true, message: "Time is required" }]}
                  >
                    <TimePicker
                      size="large"
                      className="w-full"
                      format="HH:mm"
                      minuteStep={5}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Movie"
                    name="movie"
                    rules={[{ required: true, message: "Pick a movie" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Select from catalogue"
                      showSearch
                      optionFilterProp="label"
                      options={movies.map((m) => ({
                        value: m._id,
                        label: m.movieName,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Ticket price (₹)"
                    name="ticketPrice"
                    rules={[
                      { required: true, message: "Ticket price is required" },
                    ]}
                  >
                    <Input
                      size="large"
                      type="number"
                      min={0}
                      placeholder="Per seat"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Total seats"
                    name="totalSeats"
                    rules={[
                      { required: true, message: "Seat count is required" },
                    ]}
                  >
                    <Input
                      size="large"
                      type="number"
                      min={1}
                      placeholder="Venue capacity"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <UiButton
                  size="large"
                  className="order-2 sm:order-1 sm:min-w-[120px]"
                  onClick={backToList}
                >
                  Cancel
                </UiButton>
                <UiButton
                  variant="primary"
                  size="large"
                  htmlType="submit"
                  className="order-1 sm:order-2 sm:min-w-[180px]"
                >
                  {scheduleMode === "create"
                    ? "Publish showtime"
                    : "Save changes"}
                </UiButton>
              </div>
            </Form>
          )}
        </>
      )}
    </Modal>
  );
}

export default ShowModal;
