import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "./landing/index_backup";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          SuperMQ
        </Heading>
        <p className="hero__subtitle">
          Event-driven Infrastructure for Modern Cloud
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/"
          >
            Get Started with SuperMQ
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Homepage"
      description="SuperMQ is the scalable, secure IoT Cloud Platform. Get started with SuperMQ today!"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
