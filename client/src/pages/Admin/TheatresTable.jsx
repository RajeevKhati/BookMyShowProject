import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Empty,
  Table,
  Tag,
  Typography,
} from "antd";
import { getAllTheatresForAdmin, updateTheatre } from "../../api/theatre";
import { toast } from "../../feedback/toast";
import { theme as cinematicTheme } from "../../styles/theme";
import { UiButton } from "../../components/ui";

const { Text } = Typography;

const TheatresTable = () => {
  const [theatres, setTheatres] = useState([]);

  const getData = useCallback(async () => {
    try {
      const response = await getAllTheatresForAdmin();
      if (response.success) {
        const allTheatres = response.data ?? [];
        setTheatres(
          allTheatres.map((item) => ({
            ...item,
            key: `theatre${item._id}`,
          })),
        );
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  const handleStatusChange = useCallback(
    async (theatre) => {
      try {
        const payload = {
          theatreId: theatre._id,
          isActive: !theatre.isActive,
        };
        const response = await updateTheatre(payload);
        if (response.success) {
          toast.success(response.message);
          getData();
        }
      } catch {
        /* axios interceptors */
      }
    },
    [getData],
  );

  useEffect(() => {
    getData();
  }, [getData]);

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 160,
        ellipsis: true,
        render: (text) => <span className="font-semibold text-white">{text}</span>,
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
        title: "Owner",
        dataIndex: "owner",
        key: "owner",
        width: 140,
        ellipsis: true,
        render: (_, data) =>
          data.owner?.name ?? (
            <Text type="secondary">—</Text>
          ),
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        width: 120,
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
        width: 132,
        render: (_, data) =>
          data.isActive ? (
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
        title: "Action",
        key: "action",
        width: 128,
        fixed: "right",
        render: (_, data) =>
          data.isActive ? (
            <UiButton
              variant="secondary"
              danger
              size="middle"
              onClick={() => handleStatusChange(data)}
            >
              Block
            </UiButton>
          ) : (
            <UiButton
              variant="primary"
              size="middle"
              onClick={() => handleStatusChange(data)}
            >
              Approve
            </UiButton>
          ),
      },
    ],
    [handleStatusChange],
  );

  return (
    <>
      <p
        className="mb-6 text-sm"
        style={{ color: cinematicTheme.colors.textSecondary }}
      >
        Review partner theatres. Approve to let them publish showtimes; block to
        disable access.
      </p>

      <div className="min-w-0 overflow-x-auto rounded-xl ring-1 ring-white/5">
        <Table
          dataSource={theatres}
          columns={columns}
          rowKey={(row) => row.key ?? row._id}
          scroll={{ x: 980 }}
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
                description="No theatres yet. Partner-added venues will appear here for approval."
              />
            ),
          }}
        />
      </div>
    </>
  );
};

export default TheatresTable;
