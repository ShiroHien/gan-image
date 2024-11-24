"use client";
import { useState } from "react";
import Image from "next/image";

import styles from "./page.module.css";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      upload(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      upload(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const upload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    alert(`File uploaded: ${file.name}`);

    // You can send `formData` to your backend using fetch or axios here
    // Example:
    // fetch("/upload", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error("Upload error:", error));
  };
  return (
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
  );
}
