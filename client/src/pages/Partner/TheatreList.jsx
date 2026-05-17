import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Empty,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getAllTheatres } from "../../api/theatre";
import { toast } from "../../feedback/toast";
import { theme as cinematicTheme } from "../../styles/theme";
import { UiButton } from "../../components/ui";
import DeleteTheatreModal from "./DeleteTheatreModal";
import ShowModal from "./ShowModal";
import TheatreFormModal from "./TheatreFormModal";

const { Text } = Typography;

function TheatreList() {
  const { user } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const response = await getAllTheatres(user._id);
      if (response.success) {
        const list = response.data ?? [];
        setTheatres(
          list.map((item) => ({
            ...item,
            key: `theatre${item._id}`,
          })),
        );
      } else {
        toast.error(response.message);
        setTheatres([]);
      }
    } catch (err) {
      toast.error(err.message);
      setTheatres([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const openAddTheatre = () => {
    setSelectedTheatre(null);
    setFormType("add");
    setIsModalOpen(true);
  };

  const openEditTheatre = (row) => {
    setSelectedTheatre(row);
    setFormType("edit");
    setIsModalOpen(true);
  };

  const openDeleteTheatre = (row) => {
    setSelectedTheatre(row);
    setIsDeleteModalOpen(true);
  };

  const openShowsManager = (row) => {
    setSelectedTheatre(row);
    setIsShowModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        render: (text) => (
          <span className="font-semibold text-white">{text}</span>
        ),
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        ellipsis: true,
        render: (text) =>
          text ? (
            <Text type="secondary" className="!text-[#B3B3B3]">
              {text}
            </Text>
          ) : (
            "—"
          ),
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        width: 130,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        ellipsis: true,
      },
      {
        title: "Status",
        key: "status",
        width: 128,
        render: (_, row) =>
          row.isActive ? (
            <Tag
              className="!m-0 inline-flex h-8 items-center justify-center rounded-full border-0 px-3 text-xs font-semibold uppercase tracking-wide"
              style={{
                background: `${cinematicTheme.colors.success}22`,
                color: cinematicTheme.colors.success,
              }}
            >
              Approved
            </Tag>
          ) : (
            <Tag
              className="!m-0 inline-flex h-8 items-center justify-center rounded-full border-0 px-3 text-xs font-semibold uppercase tracking-wide"
              style={{
                background: `${cinematicTheme.colors.warning}22`,
                color: cinematicTheme.colors.warning,
              }}
            >
              Pending
            </Tag>
          ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 280,
        fixed: "right",
        render: (_, row) => (
          <div className="flex flex-wrap gap-2">
            <UiButton
              variant="secondary"
              size="middle"
              icon={<EditOutlined />}
              aria-label={`Edit ${row.name}`}
              onClick={() => openEditTheatre(row)}
            />
            <UiButton
              variant="secondary"
              danger
              size="middle"
              icon={<DeleteOutlined />}
              aria-label={`Delete ${row.name}`}
              onClick={() => openDeleteTheatre(row)}
            />
            {row.isActive ? (
              <UiButton
                variant="primary"
                size="middle"
                icon={<CalendarOutlined />}
                onClick={() => openShowsManager(row)}
              >
                Shows
              </UiButton>
            ) : null}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="m-0 text-sm"
          style={{ color: cinematicTheme.colors.textSecondary }}
        >
          Register venues for admin approval. Once approved, schedule screenings
          from <strong className="text-[#E8E8E8]">Shows</strong>.
        </p>
        <UiButton
          variant="primary"
          icon={<PlusOutlined />}
          onClick={openAddTheatre}
          className="shrink-0"
        >
          Add theatre
        </UiButton>
      </div>

      <div className="min-w-0 overflow-x-auto rounded-xl ring-1 ring-white/5">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={theatres}
            columns={columns}
            rowKey={(row) => row.key ?? row._id}
            scroll={{ x: 960 }}
            pagination={
              theatres.length > 10
                ? { pageSize: 10, showSizeChanger: false }
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
                  description="No theatres yet. Add your first venue to get started."
                />
              ),
            }}
          />
        )}
      </div>

      {isModalOpen ? (
        <TheatreFormModal
          isModalOpen={isModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          setIsModalOpen={setIsModalOpen}
          formType={formType}
          getData={getData}
        />
      ) : null}

      {isDeleteModalOpen ? (
        <DeleteTheatreModal
          isDeleteModalOpen={isDeleteModalOpen}
          selectedTheatre={selectedTheatre}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData}
        />
      ) : null}

      {isShowModalOpen && selectedTheatre ? (
        <ShowModal
          isShowModalOpen={isShowModalOpen}
          setIsShowModalOpen={setIsShowModalOpen}
          selectedTheatre={selectedTheatre}
        />
      ) : null}
    </>
  );
}

export default TheatreList;
