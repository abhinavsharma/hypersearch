/**
 * @module types:augmentations
 * @version 1.0.0
 * @license (C) Insight
 */

declare type Augmentation = {
  id: string;
  name: string;
  description: string;
  conditions: Condition;
  actions: Action;
  installed?: boolean;
  pinned?: boolean;
  enabled?: boolean;
  stats?: number;
};

declare type AugmentationValidatorSetting = {
  condition_list: ConditionObject[];
  evalAsAny: boolean;
  matchingDomains: boolean;
  matchingQuery: boolean;
  matchingEngine: boolean;
  matchingIntent: { intentDomains: string[]; intentElements: HTMLElement[] };
  hasAnyPageCondition: boolean;
  numRegexConditions: number;
  matchingRegexConditions: boolean[];
  allRegexMatches: boolean;
};

declare type AugmentationRelevancyResult = {
  isHidden: boolean;
  isRelevant: boolean;
  hasPreventAutoexpand: boolean;
  domainsToLookAction: string[];
  domainsToLookCondition: string[];
  matchingIntent: Array<string | Element>;
  matchingDomainsAction: string[];
  matchingDomainsCondition: string[];
} & NullPrototype<any>;

declare type AugmentationEventType = TAugmentationEvent[keyof TAugmentationEvent];
declare type AugmentationEventStatus = TAugmentationStatus[keyof TAugmentationStatus];

declare type ActionObjectOption = Partial<TCustomActionObject>;
declare type ConditionObjectOptions = Partial<TCustomCondtionObject>;
declare type AugmentationEditOptions = Augmentation & TAugmentationOptions;

//-----------------------------------------------------------------------------------------------
// ! Action
//-----------------------------------------------------------------------------------------------

declare type Action = {
  action_list: ActionObject[];
};

declare type ActionObject = {
  label: ActionLabel;
  key: ActionKey;
  type: ActionType;
  value: ActionValue;
  id?: string;
};

declare type ActionKey = TActionKey[keyof TActionKey];
declare type ActionLabel = TActionLabel[keyof TActionLabel];
declare type ActionType = TActionType[keyof TActionType];
declare type ActionValue = Array<string | Record<string, any>>;

//-----------------------------------------------------------------------------------------------
// ! Condition
//-----------------------------------------------------------------------------------------------

declare type Condition = {
  evaluate_with: ConditionEvaluation;
  condition_list: ConditionObject[];
};

declare type ConditionObject = {
  label: ConditionObjectLabel;
  type: ConditionObjectType;
  unique_key: ConditionObjectKey;
  value: ConditionObjectValue;
  key: ConditionObjectLegacyKey | ConditionObjectKey;
  evaluation?: _ConditionEvaluation;
  id?: string;
};

declare type ConditionObjectLegacyKey = TConditionObjectLegacyKey[keyof TConditionObjectLegacyKey];
declare type ConditionEvaluation = TConditionEvaluation[keyof TConditionEvaluation];
declare type ConditionObjectKey = TConditionUniqueKey[keyof TConditionUniqueKey];
declare type ConditionObjectType = TConditionType[keyof TConditionType];
declare type ConditionObjectLabel = TConditionLabel[keyof TConditionLabel];
declare type ConditionObjectValue = ConditionValue[];
declare type ConditionValue = string | Record<string, string>;
declare type ConditionKey = ConditionObjectKey;

//-----------------------------------------------------------------------------------------------
// ! Helpers
//-----------------------------------------------------------------------------------------------

type TCustomActionObject = ActionObject & { id: string };
type TCustomCondtionObject = ConditionObject & { id: string };

type TAugmentationOptions = Partial<{
  evaluation: ConditionEvaluation;
  isActive: boolean;
  isPinning: boolean;
}>;

type TConditionKey =
  | TIConditionKey[keyof TIConditionKey]
  | TConditionUniqueKey[keyof TConditionUniqueKey];

type TAugmentationStatusRequired<T extends AugmentationStatus> = AugmentationObject & {
  status: Array<TAugmentationStatus[T] & TAugmentationStatus>;
};

type TConditionEvaluation = typeof import('constant/augmentations').CONDITION_EVALUATION;
type TIConditionKey = typeof import('constant/augmentations').LEGACY_KEY;
type TConditionLabel = typeof import('constant/augmentations').CONDITION_LABEL;
type TConditionObjectEvaluation = typeof import('constant/augmentations').LEGACY_EVALUATION;
type TConditionType = typeof import('constant/augmentations').LEGACY_CONDITION_TYPE;
type TConditionUniqueKey = typeof import('constant/augmentations').CONDITION_KEY;
type TActionKey = typeof import('constant/augmentations').ACTION_KEY;
type TActionLabel = typeof import('constant/augmentations').ACTION_LABEL;
type TActionType = typeof import('constant/augmentations').LEGACY_ACTION_TYPE;
type TAugmentationEvent = typeof import('constant/augmentations').AUGMENTATION_EVENT;
type TAugmentationStatus = typeof import('constant/augmentations').AUGMENTATION_STATUS;
type TConditionObjectLegacyKey = typeof import('constant/augmentations').LEGACY_KEY;
type TAugmentationId = typeof import('constant/augmentations').AUGMENTATION_ID;
