/**
 * RADAPLS PROJECTS
 * ------------------
 * Copyright (C) 2023 Juan Felipe Rada - All Rights Reserved.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * the express permission of Juan Felipe Rada.
 *
 * @file validation.ts
 * @author Juan Felipe Rada <radapls8@gmail.com>
 * @date Monday, 6th March 2023
 */

/** Validation */
export interface Validation
{
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validate(validInput: Validation)
{
    let isValid = true;

    if (validInput.required)
    {
        isValid = isValid && validInput.value.toString().trim().length !== 0;
    }

    if (validInput.minLength != null && typeof validInput.value === 'string')
    {
        isValid = isValid && validInput.value.length >= validInput.minLength;
    }

    if (validInput.maxLength != null && typeof validInput.value === 'string')
    {
        isValid = isValid && validInput.value.length <= validInput.maxLength;
    }

    if (validInput.min != null && typeof validInput.value === 'number')
    {
        isValid = isValid && validInput.value >= validInput.min
    }

    if (validInput.max != null && typeof validInput.value === 'number')
    {
        isValid = isValid && validInput.value <= validInput.max
    }

    return isValid;
}
