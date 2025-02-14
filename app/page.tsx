import Button from "./components/elements/Button/Button";
import "./index.scss";

export default function Home() {
  return (
    <main >
      <section className="mv">
          <img src="/top/test_mv.png" alt="" />
          <div className="title">
            <p className="catchcopy">あなたの“好き”が、誰かのキレイに。</p>
            <h1 className="siteName">Beauty Palette</h1>
          </div>
      </section>
    </main>
  );
}
