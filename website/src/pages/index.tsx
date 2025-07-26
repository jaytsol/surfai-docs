import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import Translate from '@docusaurus/Translate';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/category/project-overview">
            <Translate id="default.overview.link.text">OVERVIEW</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/category/architecture">
            <Translate id="default.architecture.link.text">ARCHITECTURE</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/category/tools">
            <Translate id="default.tools.link.text">TOOLS</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`SurfAI Docs - ${siteConfig.title}`}
      description="SurfAI 프로젝트의 공식 문서입니다. 아키텍처, API 명세, 개발 원칙 및 로드맵을 확인하세요.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}