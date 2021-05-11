import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { CustomCondition } from 'modules/pages';

declare module './ConditionsSection' {
  type TCustomCondition = CustomCondition;

  type ConditionsSectionProps = {
    conditions: CustomCondition[];
    setConditions: Dispatch<SetStateAction<CustomCondition[]>>;
    evaluation: import('utils/constants').CONDITION_LIST_EVALUATIONS;
    setEvaluation: Dispatch<SetStateAction<import('utils/constants').CONDITION_LIST_EVALUATIONS>>;
    onAdd: (e: CustomCondition) => void;
    onSave: (e: CustomCondition) => void;
    onDelete: (e: CustomCondition) => void;
  };

  type ConditionsSection = FunctionComponent<ConditionsSectionProps>;
}
