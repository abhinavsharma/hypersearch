type TFeatureGateProps = {
  feature: string;
  component: React.ReactNode;
  fallback?: React.ReactNode | null | undefined;
};

declare type Features = Record<string, boolean>;

declare type FeatureEntry = Record<'name' | 'enabled', any>;

declare type FeatureGate = React.FunctionComponent<TFeatureGateProps>;
