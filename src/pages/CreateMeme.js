import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  ColorPicker,
  Form,
  Upload,
  Space,
  InputNumber,
  Input,
  Row,
  Col,
  Image,
  Card,
} from "antd";
import { useEffect, useState } from "react";
import { FONT_SIZE, IMAGE_WIDTH, LINE_HEIGHT } from "../constants/constant";
import {
  getObjectVersion,
  getPresignedURL,
  uploadFile,
} from "../services/uploadService";
import { createSubmission } from "../services/submissionService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function CreateMeme() {
  const navigate = useNavigate();
  // State variables to manage form inputs and image preview
  const [xCoordinate, setXCoordinate] = useState(0);
  const [yCoordinate, setYCoordinate] = useState(0);
  const [color, setColor] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  // Clean up the image preview URL when the component unmounts or image changes
  useEffect(() => {
    return () => {
      image && URL.revokeObjectURL(image.preview);
    };
  }, [image]);

  // Handlers for form input changes
  const handleYCoordinateChange = (value) => {
    setYCoordinate(value);
  };
  const handleXCoordinateChange = (value) => {
    setXCoordinate(value);
  };
  const handleChangeColor = (color) => {
    setColor(color.toHexString());
  };
  const handleChangeCaption = (event) => {
    setCaption(event.target.value);
  };
  const handleChangeImage = (event) => {
    const file = event.fileList[0];
    file.preview = URL.createObjectURL(file.originFileObj);
    setImage(file);
  };

  // Form submission handler
  const onFinish = (values) => {
    let key = values.image.file.name;
    let imageUrl = "";

    // Get presigned URL, upload file, get object version, and create submission
    getPresignedURL(key)
      .then((res) => uploadFile(res.data, values.image))
      .then((res) => {
        imageUrl = res.url.split("?", 1);
        return res;
      })
      .then(() => getObjectVersion(key))
      .then((res) => {
        imageUrl += "?versionId=" + res.data;
        values = {
          ...values,
          image: imageUrl,
          color: values.color.toHexString(),
        };
      })
      .then(() => createSubmission(values))
      .then((res) => {navigate(`/submissions/${res.data}`)})
      .catch((e) => toast.error("Something wrong!"));
  };
  return (
    <Row>
      <Col span={12}>
        <h1 style={{ marginLeft: "25%" }}>Create Meme</h1>
        <Form
          name="validate_other"
          onFinish={onFinish}
          initialValues={{
            caption: "",
            x: 0,
            y: 0,
            color: null,
          }}
          style={{
            paddingBlock: 32,
          }}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 12,
          }}
        >
          {/* Image upload field */}
          <Form.Item
            name="image"
            label="Image"
            rules={[
              {
                required: true,
                message: "Image is required!",
              },
            ]}
          >
            <Upload
              name="logo"
              beforeUpload={() => false}
              onChange={handleChangeImage}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          {/* Caption input field */}
          <Form.Item
            name="caption"
            label="Caption"
            rules={[
              {
                required: true,
                message: "Caption is required!",
              },
            ]}
          >
            <Input.TextArea rows={6} onChange={handleChangeCaption} />
          </Form.Item>

          {/* X coordinate input field */}
          <Form.Item label="X coordinate">
            <Form.Item name="x" noStyle>
              <InputNumber onChange={handleXCoordinateChange} />
            </Form.Item>
            <span
              className="ant-form-text"
              style={{
                marginInlineStart: 8,
              }}
            >
              px
            </span>
          </Form.Item>

          {/* Y coordinate input field */}
          <Form.Item label="Y coordinate">
            <Form.Item name="y" noStyle>
              <InputNumber onChange={handleYCoordinateChange} />
            </Form.Item>
            <span
              className="ant-form-text"
              style={{
                marginInlineStart: 8,
              }}
            >
              px
            </span>
          </Form.Item>
          {/* Color picker field */}
          <Form.Item
            name="color"
            label="Color"
            rules={[
              {
                required: true,
                message: "Color is required!",
              },
            ]}
          >
            <ColorPicker onChange={handleChangeColor} />
          </Form.Item>
          {/* Submit button */}
          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
      {/* Overview section */}
      <Col span={12}>
        <h1>Overview</h1>
        {image && (
          <Card
            styles={{ body: { padding: 0 } }}
            style={{
              width: IMAGE_WIDTH,
              position: "relative",
              overflow: "hidden",
              borderRadius: 0,
            }}
            bordered={false}
          >
            <Image src={image.preview} alt="meme-img" preview={false} />
            <div
              style={{
                position: "absolute",
                top: `${yCoordinate}px`,
                left: `${xCoordinate}px`,
                color: `${color}`,
                fontSize: `${FONT_SIZE}px`,
                fontWeight: "bold",
                lineHeight: `${LINE_HEIGHT}px`,
                width: "100%",
              }}
            >
              {caption}
            </div>
          </Card>
        )}
      </Col>
    </Row>
  );
}
