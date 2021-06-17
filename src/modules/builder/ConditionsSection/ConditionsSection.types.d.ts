import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { CustomCondition } from 'modules/pages';

declare module './ConditionsSection' {
  type TCustomCondition = CustomCondition;

  type ConditionsSectionProps = {
    conditions: CustomCondition[];
    setConditions: Dispatch<SetStateAction<CustomCondition[]>>;
    evaluation: ConditionEvaluation;
    setEvaluation: Dispatch<SetStateAction<ConditionEvaluation>>;
    onAdd: (e: CustomCondition) => void;
    onSave: (e: CustomCondition) => void;
    onDelete: (e: CustomCondition) => void;
  };

  type ConditionsSection = FunctionComponent<ConditionsSectionProps>;
}
