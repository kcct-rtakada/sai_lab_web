import dynamic from 'next/dynamic';

// アクティブになってから読み込む
const StageComponent = dynamic(() => import('./StageComponent'), {
  ssr: false,
});

export default function Game({ resetFunc }: { resetFunc: Function }) {
  return <StageComponent resetFunc={resetFunc} />;
}
