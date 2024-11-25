"use client";
import { useState } from "react";
import Image from "next/image";

import styles from "./page.module.css";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      upload(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      upload(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const upload = async (file: File) => {
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
      console.log(data);

      setUploadedImage(data.uploaded_image_filename);
      setGeneratedImage(data.generated_image_filename);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <>
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
          <div className={styles.right}>
            <div
              className={styles.upload}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <form>
                <label className={styles.label}>
                  Tải lên hình ảnh
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              </form>
              <p>Hoặc chỉ cần thả vào đây hoặc Ctrl + V để dán hình ảnh</p>
            </div>
            <div className={styles.dashed}></div>
            <p>Không có hình ảnh? Thử một trong những cái này</p>
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
                  style={{ width: "100%", height: "auto" }}
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
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
          <div className={styles.groupBtnResult}>
            <button>+ Ảnh mới</button>

            <a href={`http://127.0.0.1:5000/${generatedImage}`} download>
              <button>Tải ảnh</button>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
