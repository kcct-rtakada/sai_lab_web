import ErrorBlock from '@/components/common/ErrorBlock';

const NotFound = () => {
  return (
    <>
      <div className='main'>
        <ErrorBlock>
          <b style={{ fontSize: '1.7rem' }}>404</b> Not Found
          <br />
          お探しのページは見つかりませんでした。
          <br />
          移動または削除された可能性があります。
        </ErrorBlock>
      </div>
    </>
  );
};

export default NotFound;
