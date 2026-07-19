// 언어·버전에 묶인 비동기 데이터를 로드하는 공용 훅
import { useEffect, useRef, useState } from 'react';
import { useConfigStore } from '@stores/configStore';
import { useVersion } from '@versioning';
import config from '../config';

type Loader<T> = (ctx: { lang: string; hash: string }) => Promise<T>;

/**
 * language/hash가 바뀌면 loader를 다시 호출한다. 이전 요청 결과는 버린다.
 * @param loader - { lang, hash }로 데이터를 가져오는 함수
 * @param initial - 초기값
 */
export function useVersionedLoad<T>(loader: Loader<T>, initial: T): T {
  const language = useConfigStore((s) => s.language) || config.language.initial;
  const { hash } = useVersion();
  const [data, setData] = useState<T>(initial);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let cancelled = false;
    void loaderRef.current({ lang: language, hash }).then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, [language, hash]);

  return data;
}
