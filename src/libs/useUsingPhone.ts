import { useSyncExternalStore } from 'react';
import getUsingPhone from './PhoneTester';

const subscribe = () => () => {};
const getSnapshot = () => (typeof navigator === 'undefined' ? false : getUsingPhone());
const getServerSnapshot = () => false;

export default function useUsingPhone() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
