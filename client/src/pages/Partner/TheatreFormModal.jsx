import { Col, Modal, Row, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { addTheatre, updateTheatre } from "../../api/theatre";
import { toast } from "../../feedback/toast";
import { UiButton } from "../../components/ui";

function TheatreFormModal({
  isModalOpen,
  setIsModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  formType,
  getData,
}) {
  const { user } = useSelector((state) => state.user);

  const formKey = `${formType}-${selectedTheatre?._id ?? "new"}`;

  const initialValues = useMemo(() => {
    if (formType !== "edit" || !selectedTheatre) return undefined;
    return selectedTheatre;
  }, [formType, selectedTheatre]);

  const onFinish = async (values) => {
    try {
      let response = null;
      if (formType === "add") {
        response = await addTheatre({ ...values, owner: user._id });
      } else {
        response = await updateTheatre({
          ...values,
          theatreId: selectedTheatre._id,
        });
      }
      if (response.success) {
        getData();
        toast.success(response.message);
        setIsModalOpen(false);
      }
      setSelectedTheatre(null);
    } catch {
      /* axios interceptors */
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTheatre(null);
  };

  return (
    <Modal
      centered
      destroyOnClose
      title={formType === "add" ? "Add theatre" : "Edit theatre"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={720}
      footer={null}
      classNames={{ body: "!pt-2" }}
    >
      <Form
        key={formKey}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        requiredMark={false}
      >
        <Row gutter={{ xs: 8, sm: 12 }}>
          <Col span={24}>
            <Form.Item
              label="Theatre name"
              name="name"
              rules={[{ required: true, message: "Theatre name is required" }]}
            >
              <Input size="large" placeholder="Venue display name" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <TextArea
                rows={3}
                size="large"
                placeholder="Street, city, landmark…"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input size="large" type="email" placeholder="contact@venue.com" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Phone is required" }]}
            >
              <Input size="large" placeholder="Customer-facing phone" />
            </Form.Item>
          </Col>
        </Row>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <UiButton
            size="large"
            className="order-2 sm:order-1 sm:min-w-[120px]"
            onClick={handleCancel}
          >
            Cancel
          </UiButton>
          <UiButton
            variant="primary"
            size="large"
            htmlType="submit"
            className="order-1 sm:order-2 sm:min-w-[140px]"
          >
            Save theatre
          </UiButton>
        </div>
      </Form>
    </Modal>
  );
}

export default TheatreFormModal;
