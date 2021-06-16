import { FunctionComponent } from 'react';

declare module './FeatureGate' {
  type FeatureGateProps = {
    feature: string;
    fallback?: React.ReactNode | null | undefined;
  };

  type FeatureGate = FunctionComponent<FeatureGateProps>;
}
