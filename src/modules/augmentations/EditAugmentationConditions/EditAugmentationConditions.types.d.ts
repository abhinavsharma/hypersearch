import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { CustomCondition } from 'modules/augmentations';

declare module './EditAugmentationConditions' {
  type EditAugmentationConditionsProps = {
    conditions: ConditionObject[];
    setConditions: Dispatch<SetStateAction<CustomCondition[]>>;
    evaluation: 'AND' | 'OR';
    setEvaluation: Dispatch<SetStateAction<'AND' | 'OR'>>;
    onAdd: (e: CustomCondition) => void;
    onSave: (e: CustomCondition) => void;
    onDelete: (e: CustomCondition) => void;
  };

  type EditAugmentationConditions = FunctionComponent<EditAugmentationConditionsProps>;
}
