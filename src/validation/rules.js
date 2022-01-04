import validator from "validator";
export const isRequired = ({ value, valueName, customMsg = null }) => {
  if (validator.isEmpty(value)) {
    return customMsg ? customMsg : `${valueName} is required.`;
  }
};
export const isEmptyArray = ({ value, valueName, customMsg = null }) => {
  if (value.length <= 0) {
    return customMsg ? customMsg : `${valueName} must have at least one item.`;
  }
};
export const isWithinLengthRange = ({
  value,
  valueName,
  min = 0,
  max = 1000,
  customMsg
}) => {
  if (!validator.isLength(value, { min: min, max: max })) {
    return customMsg
      ? customMsg
      : `${valueName} must be between ${min} - ${max} characters`;
  }
};
export const isNumeric = ({ value, valueName, customMsg = null }) => {
  if (!validator.isNumeric(value)) {
    return customMsg ? customMsg : `${valueName} must be numeric`;
  }
};
export const isPositive = ({ value, valueName, customMsg = null }) => {
  if (!validator.isNumeric(value) || Number(value) <= 0) {
    return customMsg ? customMsg : `${valueName} must be a positive number`;
  }
};
export const isPositiveN = ({ value, valueName, customMsg = null }) => {
  if (!validator.isNumeric(value) || Number(value) < 0) {
    return customMsg ? customMsg : `${valueName} cannot be negative`;
  }
};
export const isGeLe = ({
  value1,
  valueName1,
  value2,
  valueName2,
  comparisonFunction,
  modeString,
  customMsg = null
}) => {
  if (!comparisonFunction(Number(value1), Number(value2))) {
    return customMsg
      ? customMsg
      : `${valueName1} must be ${modeString} ${valueName2}`;
  }
};

export const isUrl = ({ value, valueName, customMsg = null }) => {
  if (!validator.isURL(value)) {
    return customMsg ? customMsg : `${valueName} is not a valid url`;
  }
};
