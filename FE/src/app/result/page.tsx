import styles from "./result.module.css";
function Result() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1>Ảnh gốc</h1>
          <div className={styles.img}>
            <img src="/hero_banner_static.png" alt="" />
          </div>
        </div>
        <div className={styles.dashed}></div>
        <div className={styles.right}>
          <h1>Ảnh làm nét</h1>
          <div className={styles.imgResult}>
            <img src="/hero_banner_static.png" alt="" />
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
