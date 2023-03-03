/**
 * RADAPLS PROJECTS
 * ------------------
 * Copyright (C) 2023 Juan Felipe Rada - All Rights Reserved.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * the express permission of Juan Felipe Rada.
 *
 * @file app.ts
 * @author Juan Felipe Rada <radapls8@gmail.com>
 * @date Friday, 15th November 2019
 */

/** Validation */
interface Validation
{
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validInput: Validation)
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


/** Auto-bind decorator */
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor)
{
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get()
        {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjustedDescriptor;
}



class ProjectInput
{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleElement: HTMLInputElement;
    descriptionElement: HTMLInputElement;
    peopleElement: HTMLInputElement;

    constructor()
    {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedContent = document.importNode(this.templateElement.content, true);
        this.element = importedContent.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleElement = this.element.querySelector('#people')! as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [ string, string, number ] | void
    {
        const enteredTitle = this.titleElement.value;
        const enteredDescription = this.descriptionElement.value;
        const enteredPeople = this.peopleElement.value;

        const titleValidation: Validation = {
            value: enteredTitle,
            required: true
        };

        const descriptionValidation: Validation = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };

        const peopleValidation: Validation = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };

        if (!validate(titleValidation) || !validate(descriptionValidation) || !validate(peopleValidation))
        {
            alert('Invalid Input, please try again!');
            return;
        } else
        {
            return [ enteredTitle, enteredDescription, +enteredPeople ];
        }
    }

    private clearInputs()
    {
        this.titleElement.value = '';
        this.descriptionElement.value = '';
        this.peopleElement.value = '';
    }


    @AutoBind
    private handleSubmit(event: Event)
    {
        event.preventDefault();
        const userInput = this.gatherUserInput();

        if (Array.isArray(userInput))
        {
            const [ title, description, people ] = userInput;
            console.log(title, description, people);
            this.clearInputs();
        }
    }

    private configure()
    {
        this.element.addEventListener('submit', this.handleSubmit);
    }

    private attach()
    {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput()