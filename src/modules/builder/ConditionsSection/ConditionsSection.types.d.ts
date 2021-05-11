import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { CustomCondition } from 'modules/builder';

<<<<<<< HEAD:src/modules/builder/EditAugmentationConditions/EditAugmentationConditions.types.d.ts
declare module './EditAugmentationConditions' {
  type TCustomCondition = CustomCondition;

  type EditAugmentationConditionsProps = {
=======
declare module './ConditionsSection' {
  type ConditionsSectionProps = {
>>>>>>> chore: rename builder and page copmponents:src/modules/builder/ConditionsSection/ConditionsSection.types.d.ts
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
