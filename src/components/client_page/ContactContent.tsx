/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';
import Link from 'next/link';
import styles from '@/styles/app/contact/contact.module.scss';
import { Title } from '../common/SubPageLayout';

export default function ContactContent() {
  const [usingJapanese, setUsingJapanese] = useState<boolean>(true);

  // 2言語の切り替えを行う
  const displayString = (japaneseString: string, englishString: string) => {
    return <>{usingJapanese ? parse(japaneseString) : parse(englishString)}</>;
  };

  return (
    <div className={styles.main}>
      <Title color1='#ec5bc1' color2='#da5046'>
        {displayString('コンタクト', 'Contact')}
      </Title>
      <div className={styles.main_script}>
        <h2>{displayString('コンタクト', 'Contact')}</h2>
        <p>{displayString('研究室への', 'If you are:')}</p>
        <ul>
          <li>
            {displayString(
              'SAIへの配属希望・研究室説明希望',
              'willing to apply to the Lab or wishing for an information session',
            )}
          </li>
          <li>
            {displayString(
              '他学科・他学年学生だけど研究に興味がある',
              'interested in experimenting though you belong in a different department or grade',
            )}
          </li>
          <li>{displayString('共同研究依頼', 'requesting for a cooperative research')}</li>
          <li>{displayString('取材依頼', 'requesting for an interview')}</li>
        </ul>
        <p>
          {displayString(
            '等があれば下記フォームよりお気軽にご連絡ください。',
            'feel free to contact from the form below.',
          )}
        </p>
        <p>
          {displayString(
            `また、指導教員（髙田）個人への連絡は
          <a href="mailto:kcct-rtakada@g.kobe-kosen.ac.jp">kcct-rtakada@g.kobe-kosen.ac.jp</a>でも受け付けています。`,
            `Direct contact to the supervisor(Takada) is also available through <a href="mailto:kcct-rtakada@g.kobe-kosen.ac.jp">kcct-rtakada@g.kobe-kosen.ac.jp</a>.`,
          )}
        </p>
        <h2>{displayString('アクセス', 'Access')}</h2>
        <p>
          <Link
            href='https://www.kobe-kosen.ac.jp/introduction/introduction01/sisetu/'
            target='_blank'
            rel='noopener noreferrer'
          >
            {displayString('神戸高専アクセス情報：', 'Access information for KCCT: ')}
            https://www.kobe-kosen.ac.jp/introduction/introduction01/sisetu
          </Link>
        </p>
        <p>
          {displayString(
            '上記ウェブページのキャンパスマップ内にある「電子工学科棟3F」で活動しております。',
            'We are located on the 3rd floor of 「電子工学科棟」on the Campus Map in the webpage above.',
          )}
        </p>
        <h2>{displayString('フォーム', 'Contact Form')}</h2>
        <p>
          <Link href='https://forms.gle/JngM8dAN5b6yAtBv9' target='_blank' rel='noopener noreferrer'>
            {displayString(
              `SAI（神戸高専
            髙田研究室）問い合わせフォーム：`,
              `SAI(KCCT Takada Lab) Contact Form: `,
            )}
            https://forms.gle/JngM8dAN5b6yAtBv9
          </Link>
        </p>
        {/* Google Formの埋め込み */}
        <iframe
          src='https://docs.google.com/forms/d/e/1FAIpQLSeP-U1M1MeJIp4b5wBAlDmgptdyLxOWacAZVLIPezzGssslhw/viewform?embedded=true'
          width='640'
          height='1171'
        >
          読み込んでいます…
        </iframe>
        <div className={styles.language_switching_box}>
          <button
            title={usingJapanese ? 'Switch from Japanese to English' : '英語から日本語へ切り替える'}
            onClick={() => setUsingJapanese(!usingJapanese)}
          >
            {usingJapanese ? (
              <span>
                日
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  style={{
                    margin: '0 .15rem',
                    fontSize: '1.15rem',
                    width: '1.15rem',
                    display: 'inline-block',
                  }}
                />
                EN
              </span>
            ) : (
              <span>
                EN
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  style={{
                    margin: '0 .15rem',
                    fontSize: '1.15rem',
                    width: '1.15rem',
                    display: 'inline-block',
                  }}
                />
                日
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
