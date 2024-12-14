'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getUsingPhone from '@/libs/PhoneTester';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState<boolean>(false);
  const [isUsingPhone, setIsUsingPhone] = useState<boolean>(false);

  useEffect(() => {
    // スマホ機種では表示させない
    setIsUsingPhone(getUsingPhone());
  }, []);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (isUsingPhone) return null;
  return (
    <React.Fragment>
      <button onClick={() => copyText(text)} title='Copy citation'>
        <FontAwesomeIcon
          icon={!copied ? faCopy : faCheck}
          style={{
            display: 'inline-block',
            color: `${!copied ? '#1e1e1e' : '#014923'}`,
            fontSize: '1rem',
            width: '1rem',
            cursor: 'pointer',
            transition: 'color 0.15s',
            WebkitTransition: 'color 0.15s',
          }}
        />
      </button>
      <p
        style={{
          userSelect: 'none',
          color: '#014923',
          display: 'inline-block',
          opacity: `${copied ? '1' : '0'}`,
          transition: 'opacity 0.15s',
          WebkitTransition: 'opacity 0.15s',
        }}
      >
        &nbsp;Copied!
      </p>
    </React.Fragment>
  );
}
