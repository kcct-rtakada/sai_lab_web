import { notFound } from 'next/navigation';

// 未登録のパスが入った時
const NotFoundCatchAll = () => {
  notFound();
};

export default NotFoundCatchAll;