export const validations: Validations = {
  required: {
    default: 'The :attribute field is required.',
  },
  maxlength: {
    text: 'The :attribute field must not be longer than :requiredLength characters.',
    number: 'The :attribute field must not be longer than :requiredLength digits.'
  },
  minlength: {
    text: 'The :attribute field must be at least :requiredLength characters.',
    number: 'The :attribute field must be at least :requiredLength digits.'
  },
  max: {
    default: 'The :attribute field must not be greater than :max.'
  },
  min: {
    default: 'The :attribute field must be at least :min.'
  },
  invalidRange: {
    default: 'You must select a valid date range.',
  },
};

export const defaultValidation = 'The :attribute field is invalid.';

export interface Validations {
  [key: string]: ValidationType
}

export interface ValidationType {
  [key: string]: string
}