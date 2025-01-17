import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [

  {
    title: 'Focus on What Matters',
    Svg: require('../../static/img/homecare.svg').default,
    description: (
      <>
      <p><strong>iCare</strong>  let you focus on the <code>HEALTH</code> of your <code>Patients</code></p> 
      </>
    ),
  },

];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col-4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
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
