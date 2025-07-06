import Translate from '@docusaurus/Translate';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: ReactNode;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: (
      <Translate id="homepage.features.livingDocs.title">
        살아있는 문서 (Living Documentation)
      </Translate>
    ),
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default, // 아이콘은 일단 유지
    description: (
      <Translate id="homepage.features.livingDocs.description">
        코드가 진화하는 속도에 맞춰 문서도 함께 업데이트됩니다.
        Gemini 에이전트가 코드 변경을 감지하고 문서 업데이트를 제안하여,
        항상 최신 상태의 정확한 정보를 제공합니다.
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.features.diagramsAsCode.title">
        코드로 관리하는 다이어그램 (Diagrams as Code)
      </Translate>
    ),
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default, // 아이콘은 일단 유지
    description: (
      <Translate id="homepage.features.diagramsAsCode.description">
        복잡한 아키텍처 다이어그램과 시퀀스 다이어그램을 Mermaid.js 코드로 관리합니다.
        Git으로 버전 관리가 가능하며, 텍스트 에디터에서 쉽게 수정하고
        웹사이트에서 아름다운 다이어그램으로 렌더링됩니다.
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.features.accessibility.title">
        모두를 위한 접근성 (Accessibility for All)
      </Translate>
    ),
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default, // 아이콘은 일단 유지
    description: (
      <Translate id="homepage.features.accessibility.description">
        개발자는 Git 기반의 효율적인 워크플로우를 유지하고,
        비개발 팀원은 별도의 설치 없이 웹 브라우저를 통해
        항상 최신화된 문서를 손쉽게 조회하고 검색할 수 있습니다.
      </Translate>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}