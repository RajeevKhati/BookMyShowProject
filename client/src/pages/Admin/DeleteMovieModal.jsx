import { Modal } from "antd";
import { deleteMovie } from "../../api/movie";
import { toast } from "../../feedback/toast";

const DeleteMovieModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedMovie,
  setSelectedMovie,
  getData,
}) => {
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
    } catch (err) {
      setIsDeleteModalOpen(false);
    }
  };
  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Modal
      title="Delete Movie?"
      open={isDeleteModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Are you sure you want to delete this movie?</p>
    </Modal>
  );
};

export default DeleteMovieModal;
