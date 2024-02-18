import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Understand',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        I Write documentation to be easy to understand regardless of Skill level.
      </>
    ),
  },
  {
    title: 'Support offered',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>  
        If you believe the documentation doesn't address a certain item or quirk shoot me an message and i will reply.
      </>
    ),
  },
  {
    title: 'Ad-less',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        I don't intend to make money via Advertising or blocking off documentation, i believe that the best way to make Self-hosting a viable alternative is Free, Open and reliable documentation.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
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

export default function HomepageFeatures() {
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
