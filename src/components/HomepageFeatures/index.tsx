import clsx from "clsx";

import Heading from "@theme/Heading";

import styles from "./styles.module.css";

type FeatureItem = {
  title: string;

  Svg: React.ComponentType<React.ComponentProps<"svg">>;

  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Scalable Messaging Middleware",

    Svg: require("@site/static/img/scalability.svg").default,

    description: (
      <>
        SuperMQ provides a robust middleware solution, supporting HTTP, MQTT, WebSocket, and CoAP protocols for seamless communication.
      </>
    ),
  },

  {
    title: "Client Management",

    Svg: require("@site/static/img/device_management.svg").default,

    description: (
      <>
        Manage your clients, groups and secure communications using fine-grained access control and token-based authentication.
      </>
    ),
  },

  {
    title: "Open Source",

    Svg: require("@site/static/img/open_source.svg").default,

    description: (
      <>
        SuperMQ is fully open-source and patent-free, fostering community-driven innovation and collaboration.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
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

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: This is a static list
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
