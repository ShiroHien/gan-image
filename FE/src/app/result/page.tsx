import styles from "./result.module.css";
import Image from "next/image";
function Result() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1>Ảnh gốc</h1>
          <div className={styles.img}>
            <Image
              src="/hero_banner_static.png"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
        <div className={styles.dashed}></div>
        <div className={styles.right}>
          <h1>Ảnh làm nét</h1>
          <div className={styles.imgResult}>
            <Image
              src="/hero_banner_static.png"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </div>
      <div className={styles.groupBtn}>
        <button>+ Ảnh mới</button>

        <a href="/hero_banner_static.png" download>
          <button>Tải ảnh</button>
        </a>
      </div>
    </div>
  );
}
export default Result;
