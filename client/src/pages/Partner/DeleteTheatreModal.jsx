import { Modal, Typography } from "antd";
import { deleteTheatre } from "../../api/theatre";
import { toast } from "../../feedback/toast";
import { theme as cinematicTheme } from "../../styles/theme";

const { Text, Paragraph } = Typography;

function DeleteTheatreModal({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) {
  const name = selectedTheatre?.name ?? "this theatre";

  const handleOk = async () => {
    try {
      const theatreId = selectedTheatre._id;
      const response = await deleteTheatre(theatreId);
      if (response.success) {
        getData();
        toast.success(response.message);
        setIsDeleteModalOpen(false);
      }
      setSelectedTheatre(null);
    } catch {
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
      title={
        <span className="text-lg font-semibold text-white">Remove theatre</span>
      }
      open={isDeleteModalOpen}
      okText="Delete"
      okButtonProps={{ danger: true }}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Paragraph className="!mb-1 !mt-2 text-[#E8E8E8]">
        Delete{" "}
        <Text strong style={{ color: cinematicTheme.colors.primary }}>
          {name}
        </Text>
        ? Shows tied to this venue may also be affected on the server.
      </Paragraph>
      <Text type="secondary" className="text-sm">
        This cannot be undone from the dashboard.
      </Text>
    </Modal>
  );
}

export default DeleteTheatreModal;
