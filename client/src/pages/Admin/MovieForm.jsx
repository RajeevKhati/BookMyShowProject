import { Col, DatePicker, Modal, Row, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useMemo } from "react";
import { addMovie, updateMovie } from "../../api/movie";
import dayjs from "../../utils/dayjs";
import { toast } from "../../feedback/toast";
import { UiButton } from "../../components/ui";
import { MOVIE_GENRE_OPTIONS, MOVIE_LANGUAGE_OPTIONS } from "./constants";

const MovieForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedMovie,
  setSelectedMovie,
  formType,
  getData,
}) => {
  const formInitialValues = useMemo(() => {
    if (formType !== "edit" || !selectedMovie) return undefined;
    return {
      ...selectedMovie,
      releaseDate: selectedMovie.releaseDate
        ? dayjs(selectedMovie.releaseDate)
        : undefined,
    };
  }, [formType, selectedMovie]);

  const formKey = `${formType}-${selectedMovie?._id ?? "new"}`;

  const onFinish = async (values) => {
    try {
      const releaseDate =
        values.releaseDate?.format?.("YYYY-MM-DD") ?? values.releaseDate;
      const payload = { ...values, releaseDate };

      let response = null;
      if (formType === "add") {
        response = await addMovie(payload);
      } else {
        response = await updateMovie({
          ...payload,
          movieId: selectedMovie._id,
        });
      }
      if (response.success) {
        getData();
        toast.success(response.message);
        setIsModalOpen(false);
      }
      setSelectedMovie(null);
    } catch {
      /* axios interceptors */
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Modal
      centered
      destroyOnClose
      title={formType === "add" ? "Add movie" : "Edit movie"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={840}
      footer={null}
      classNames={{ body: "!pt-2" }}
    >
      <Form
        key={formKey}
        layout="vertical"
        initialValues={formInitialValues}
        onFinish={onFinish}
        requiredMark={false}
      >
        <Row gutter={{ xs: 8, sm: 12 }}>
          <Col span={24}>
            <Form.Item
              label="Movie name"
              name="movieName"
              rules={[{ required: true, message: "Movie name is required" }]}
            >
              <Input size="large" placeholder="Enter the movie title" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea
                rows={4}
                size="large"
                placeholder="Short synopsis shown to viewers"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Duration (minutes)"
              name="duration"
              rules={[{ required: true, message: "Duration is required" }]}
            >
              <Input
                size="large"
                type="number"
                min={1}
                placeholder="Minutes"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Language"
              name="language"
              rules={[{ required: true, message: "Language is required" }]}
            >
              <Select
                size="large"
                placeholder="Select language"
                options={MOVIE_LANGUAGE_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Release date"
              name="releaseDate"
              rules={[{ required: true, message: "Release date is required" }]}
            >
              <DatePicker
                size="large"
                className="w-full"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Genre"
              name="genre"
              rules={[{ required: true, message: "Genre is required" }]}
            >
              <Select
                size="large"
                placeholder="Select genre"
                options={MOVIE_GENRE_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16}>
            <Form.Item
              label="Poster URL"
              name="poster"
              rules={[{ required: true, message: "Poster URL is required" }]}
            >
              <Input size="large" placeholder="HTTPS link to poster image" />
            </Form.Item>
          </Col>
        </Row>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <UiButton size="large" className="order-2 sm:order-1 sm:min-w-[120px]" onClick={handleCancel}>
            Cancel
          </UiButton>
          <UiButton
            variant="primary"
            size="large"
            htmlType="submit"
            className="order-1 sm:order-2 sm:min-w-[160px]"
          >
            Save movie
          </UiButton>
        </div>
      </Form>
    </Modal>
  );
};

export default MovieForm;
