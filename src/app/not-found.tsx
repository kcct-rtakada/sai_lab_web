import Image from "next/image";

const NotFound = () => {
  return (
    <>
      <div className="main">
        <div className="notfound">
          <div className="notfound_text">
            <b style={{fontSize: "1.7rem"}}>404</b> Not Found
            <br />
            お探しのページは見つかりませんでした。
            <br />
            移動または削除された可能性があります。
          </div>
          <div className="notfound_img_box">
            <Image src="/sai_logo.png" alt="sai_logo" fill sizes="4rem" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
