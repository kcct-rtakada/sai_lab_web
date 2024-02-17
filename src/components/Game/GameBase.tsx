import dynamic from "next/dynamic";

const StageComponent = dynamic(() => import("./StageComponent"), {
  ssr: false,
});

export default function Game({resetFunc}: {resetFunc: Function}) {
  return <StageComponent resetFunc={resetFunc} />;
}
