import { Modal, Typography } from "antd";
import { deleteMovie } from "../../api/movie";
import { toast } from "../../feedback/toast";
import { theme as cinematicTheme } from "../../styles/theme";

const { Text, Paragraph } = Typography;

const DeleteMovieModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedMovie,
  setSelectedMovie,
  getData,
}) => {
  const movieName = selectedMovie?.movieName ?? "this movie";

  const handleOk = async () => {
    try {
      const movieId = selectedMovie._id;
      const response = await deleteMovie({ movieId });
      if (response.success) {
        toast.success(response.message);
        getData();
      }
      setSelectedMovie(null);
      setIsDeleteModalOpen(false);
    } catch {
      setIsDeleteModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Modal
      title={
        <span className="text-lg font-semibold text-white">Remove movie</span>
      }
      open={isDeleteModalOpen}
      okText="Delete"
      okButtonProps={{ danger: true }}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
    >
      <Paragraph className="!mb-1 !mt-2 text-[#E8E8E8]">
        Are you sure you want to delete{" "}
        <Text strong style={{ color: cinematicTheme.colors.primary }}>
          {movieName}
        </Text>
        ?
      </Paragraph>
      <Text type="secondary" className="text-sm">
        This removes it from the catalogue. Existing bookings may still need handling
        on the server.
      </Text>
    </Modal>
  );
};

export default DeleteMovieModal;
