export const GENDER_OPTIONS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
]

export const GENDER_VALUES = GENDER_OPTIONS.map(option => option.value);
export const GENDERS = [
    "Male",
    "Female",
    "Other",
] as const;

export type Gender = typeof GENDERS[number];
