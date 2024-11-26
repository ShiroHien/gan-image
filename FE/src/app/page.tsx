"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const suggestedImages = ["/image.png", "/image1.png", "/image2.png"];
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handleSuggestedImageClick = (imageUrl: string) => {
    setPreview(imageUrl);
  };
  const upload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUploadedImage(data.uploaded_image_filename);
      setGeneratedImage(data.generated_image_filename);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <>
      {isLoading && (
        <div className={styles["container-loader"]}>
          <div className={styles["custom-loader"]}></div>
        </div>
      )}
      {!generatedImage && (
        <div className={styles.container}>
          <div className={styles.left}>
            <h1>Gia tăng độ phân giải hình ảnh</h1>
            <p>Công cụ gia tăng độ phân giải hình ảnh</p>
            <Image
              src="/hero_banner_static.png"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "95%", height: "auto" }}
            />
          </div>
          <div
            className={styles.right}
            style={{
              padding: !preview ? "100px 50px" : "50px",
              width: !preview ? "auto" : "34%",
              height: !preview ? "30%" : "auto",
              position: "relative",
            }}
          >
            <div
              className={styles.upload}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetch(preview)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const file = new File([blob], "image.png", {
                        type: blob.type,
                      });
                      upload(file); // Upload the file
                    });
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {preview && (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{
                      width: "100%",
                      height: "auto",
                      paddingBottom: "10px",
                    }}
                  />
                )}
                <div>
                  <label
                    className={styles.label}
                    style={{
                      fontSize: !preview ? "24px" : "19px",
                      padding: !preview ? "20px 76px" : "8px 33px",
                      backgroundColor: !isLoading ? "#3151ce " : "#C0c0c0",
                      cursor: !isLoading ? "pointer" : "not-allowed",
                    }}
                  >
                    Tải lên hình ảnh
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                  </label>
                  {preview && (
                    <input
                      type="submit"
                      value="Gửi ảnh"
                      disabled={isLoading}
                      style={{
                        backgroundColor: !isLoading ? "#3151ce" : "#C0c0c0",
                        cursor: !isLoading ? "pointer" : "not-allowed",
                      }}
                    />
                  )}
                </div>
              </form>
              <p style={{ paddingTop: "15px" }}>
                Hoặc chỉ cần thả vào đây hoặc Ctrl + V để dán hình ảnh
              </p>
            </div>
            <div className={styles.dashed}></div>
            <p>Không có hình ảnh? Thử một trong những ảnh này</p>

            <div style={{ display: "flex", gap: "20px" }}>
              {suggestedImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestedImageClick(image)}
                  style={{ flex: "1 0 30%" }}
                >
                  <Image
                    src={image}
                    alt={`Suggested Image ${index + 1}`}
                    width={0}
                    height={0}
                    sizes="10vw"
                    style={{
                      width: "100%",
                      maxWidth: "150px",
                      maxHeight: "150px",
                      height: "auto",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {uploadedImage && (
        <div className={styles.containerResult}>
          <div className={styles.contentResult}>
            <div className={styles.leftResult}>
              <h1>Ảnh gốc</h1>
              <div className={styles.imgResult}>
                <Image
                  src={`http://127.0.0.1:5000/static/uploads/${uploadedImage}`}
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto", minHeight: "300px" }}
                />
              </div>
            </div>
            <div className={styles.dashedResult}></div>
            <div className={styles.rightResult}>
              <h1>Ảnh làm nét</h1>
              <div className={styles.imgGeneratedResult}>
                <Image
                  src={`http://127.0.0.1:5000/static/generated/${generatedImage}`}
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto", minHeight: "300px" }}
                />
              </div>
            </div>
          </div>
          <div className={styles.groupBtnResult}>
            <button
              onClick={() => {
                setUploadedImage("");
                setGeneratedImage("");
              }}
            >
              + Ảnh mới
            </button>

            <button
              onClick={async () => {
                try {
                  const response = await fetch(
                    `http://127.0.0.1:5000/static/generated/${generatedImage}`
                  );
                  if (!response.ok) {
                    throw new Error("Failed to fetch image");
                  }

                  const blob = await response.blob();
                  const link = document.createElement("a");
                  const url = URL.createObjectURL(blob);

                  link.href = url;
                  link.download = generatedImage;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  URL.revokeObjectURL(url);
                } catch (error) {
                  console.error("Error downloading image:", error);
                }
              }}
            >
              Tải ảnh
            </button>
          </div>
        </div>
      )}
    </>
  );
}
