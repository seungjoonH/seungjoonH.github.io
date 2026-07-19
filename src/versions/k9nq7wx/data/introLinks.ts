// 버전별 introLinks 오버라이드 데이터
/**
 * k9nq7wx 전용 인트로 스포일러 정의. 공통 `introLinksConfig`와 병합된다.
 * - mbwtPerf: 비커 렌더링 최적화 문서 + Docs 섹션
 * - mbwtStack: 물방울톡 프로젝트(서버/API 관련)
 * - mbwtInfra: 물방울톡 인프라(프로젝트 + 서비스 아키텍처 문서)
 */
export default {
  mbwtPerf: {
    kind: 'mixed',
    rows: [
      {
        docId: 'rendering-optimization-input-burst',
        labelKey: 'main.introLink.rowMbwtRenderingDoc',
        icon: 'document',
      },
      {
        targetId: 'docs',
        labelKey: 'main.introLink.rowDocs',
        icon: 'document',
      },
    ],
  },
  mbwtStack: {
    kind: 'search',
    rows: [
      {
        query: 'title:"물방울톡"|title:"Moolbangwool Talk"',
        labelKey: 'main.introLink.rowMulbangultalk',
        icon: 'search',
      },
    ],
  },
  mbwtInfra: {
    kind: 'mixed',
    rows: [
      {
        query: 'title:"물방울톡"|title:"Moolbangwool Talk"',
        labelKey: 'main.introLink.rowMulbangultalk',
        icon: 'search',
      },
      {
        docId: 'mbwt-service-architecture',
        labelKey: 'main.introLink.rowMbwtServiceArchitecture',
        icon: 'document',
      },
    ],
  },
};
