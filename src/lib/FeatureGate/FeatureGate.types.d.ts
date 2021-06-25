import { FunctionComponent } from 'react';

declare module './FeatureGate' {
  type Features = Record<string, boolean>;

  type FeatureEntry = Record<'name' | 'enabled', any>;

  type FeatureGateProps = {
    feature: string;
    component: React.ReactNode;
    fallback?: React.ReactNode | null | undefined;
  };

  type FeatureGate = FunctionComponent<FeatureGateProps>;
}
