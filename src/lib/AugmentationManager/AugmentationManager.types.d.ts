declare module './AugmentationManager' {
  type AugmentationData = {
    actions?: ActionObject[];
    conditions?: ConditionObject[];
    conditionEvaluation?: 'OR' | 'AND';
    description?: string;
    name?: string;
    isActive?: boolean;
    isPinning?: boolean;
  };
}

export {};
