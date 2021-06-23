type TFeatureGateProps = {
  feature: string;
  fallback?: React.ReactNode | null | undefined;
};

declare type FeatureEntry = Record<string, boolean>;

declare type FeatureGate = React.FunctionComponent<TFeatureGateProps>;
