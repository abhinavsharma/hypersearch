import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { CustomCondition } from 'modules/augmentations';

declare module './EditAugmentationConditions' {
  type TCustomCondition = CustomCondition;

  type EditAugmentationConditionsProps = {
    conditions: CustomCondition[];
    setConditions: Dispatch<SetStateAction<CustomCondition[]>>;
    evaluation: import('utils/constants').CONDITION_LIST_EVALUATIONS;
    setEvaluation: Dispatch<SetStateAction<import('utils/constants').CONDITION_LIST_EVALUATIONS>>;
    onAdd: (e: CustomCondition) => void;
    onSave: (e: CustomCondition) => void;
    onDelete: (e: CustomCondition) => void;
  };

  type EditAugmentationConditions = FunctionComponent<EditAugmentationConditionsProps>;
}
