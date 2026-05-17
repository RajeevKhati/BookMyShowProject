import { Modal } from "antd";
import { deleteTheatre } from "../../api/theatre";
import { toast } from "../../feedback/toast";

const DeleteTheatreModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) => {
  const handleOK = async () => {
    try {
      const theatreId = selectedTheatre._id;
      const response = await deleteTheatre(theatreId);
      if (response.success) {
        getData();
        toast.success(response.message);
        setIsDeleteModalOpen(false);
      }
      setSelectedTheatre(null);
    } catch (err) {
      setIsDeleteModalOpen(false);
    }
  };
  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedTheatre(null);
  };
  return (
    <Modal
      centered
      title="Delete Theatre?"
      open={isDeleteModalOpen}
      onOk={handleOK}
      onCancel={handleCancel}
    >
      <p>Are you sure you want to delete this theatre?</p>
    </Modal>
  );
};

export default DeleteTheatreModal;
