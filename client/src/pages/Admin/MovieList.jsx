import { useCallback, useEffect, useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Empty, Spin, Table, Tooltip } from "antd";
import moment from "moment";
import { getAllMovies } from "../../api/movie";
import { toast } from "../../feedback/toast";
import { theme as cinematicTheme } from "../../styles/theme";
import { UiButton } from "../../components/ui";
import DeleteMovieModal from "./DeleteMovieModal";
import MovieForm from "./MovieForm";

function MovieList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formType, setFormType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllMovies();
      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      if (response?.success === false) {
        toast.error(response?.message || "Could not load movies.");
        setMovies([]);
      } else {
        setMovies(
          list.map((item) => ({
            ...item,
            key: `movie${item._id}`,
          })),
        );
      }
    } catch (e) {
      toast.error(e?.message || "Could not load movies.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const openAdd = () => {
    setSelectedMovie(null);
    setFormType("add");
    setIsModalOpen(true);
  };

  const openEdit = (row) => {
    setSelectedMovie(row);
    setFormType("edit");
    setIsModalOpen(true);
  };

  const openDelete = (row) => {
    setSelectedMovie(row);
    setIsDeleteModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        title: "Poster",
        dataIndex: "poster",
        key: "poster",
        width: 88,
        fixed: "left",
        render: (src) => (
          <div
            className="h-[72px] w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10"
            style={{ background: cinematicTheme.colors.background }}
          >
            {src ? (
              <img
                src={src}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-[10px] text-[#808080]">
                —
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Movie",
        dataIndex: "movieName",
        key: "movieName",
        width: 160,
        ellipsis: true,
        render: (text) => (
          <span className="font-semibold text-white">{text}</span>
        ),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        render: (text) =>
          text ? (
            <Tooltip title={text}>
              <span className="text-[#B3B3B3]">{text}</span>
            </Tooltip>
          ) : (
            "—"
          ),
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        width: 100,
        render: (m) => (m != null ? `${m} min` : "—"),
      },
      {
        title: "Genre",
        dataIndex: "genre",
        key: "genre",
        width: 110,
        ellipsis: true,
      },
      {
        title: "Language",
        dataIndex: "language",
        key: "language",
        width: 100,
      },
      {
        title: "Release",
        dataIndex: "releaseDate",
        key: "releaseDate",
        width: 120,
        render: (_, row) =>
          row.releaseDate
            ? moment(row.releaseDate).format("MMM D, YYYY")
            : "—",
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        fixed: "right",
        render: (_, row) => (
          <div className="flex flex-wrap gap-2">
            <UiButton
              variant="secondary"
              size="middle"
              aria-label={`Edit ${row.movieName}`}
              icon={<EditOutlined />}
              onClick={() => openEdit(row)}
            />
            <UiButton
              variant="secondary"
              danger
              size="middle"
              aria-label={`Delete ${row.movieName}`}
              icon={<DeleteOutlined />}
              onClick={() => openDelete(row)}
            />
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
          Add, edit, or remove titles in the catalogue.
        </p>
        <UiButton
          variant="primary"
          icon={<PlusOutlined />}
          onClick={openAdd}
          className="shrink-0"
        >
          Add movie
        </UiButton>
      </div>

      <div className="min-w-0 overflow-x-auto rounded-xl ring-1 ring-white/5">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={movies}
            columns={columns}
            pagination={
              movies.length > 10
                ? { pageSize: 10, showSizeChanger: false }
                : false
            }
            scroll={{ x: 1100 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  styles={{
                    description: {
                      color: cinematicTheme.colors.textSecondary,
                    },
                  }}
                  description="No movies yet. Create one to populate the catalogue."
                />
              ),
            }}
          />
        )}
      </div>

      {isModalOpen ? (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedMovie={selectedMovie}
          formType={formType}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      ) : null}
      {isDeleteModalOpen ? (
        <DeleteMovieModal
          isDeleteModalOpen={isDeleteModalOpen}
          selectedMovie={selectedMovie}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      ) : null}
    </>
  );
}

export default MovieList;
