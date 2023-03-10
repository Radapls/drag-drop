/**
 * RADAPLS PROJECTS
 * ------------------
 * Copyright (C) 2023 Juan Felipe Rada - All Rights Reserved.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * the express permission of Juan Felipe Rada.
 *
 * @file project-input.ts
 * @author Juan Felipe Rada <radapls8@gmail.com>
 * @date Monday, 6th March 2023
 */

import { AutoBind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import * as Validate from "../utils/validation";
import Component from "./base-component";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>
{
    titleElement: HTMLInputElement;
    descriptionElement: HTMLInputElement;
    peopleElement: HTMLInputElement;

    constructor()
    {
        super('project-input', 'app', true, 'user-input');

        this.titleElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleElement = this.element.querySelector('#people')! as HTMLInputElement;

        this.configure();
    }

    configure()
    {
        this.element.addEventListener('submit', this.handleSubmit);
    }

    renderContent(): void { }

    private gatherUserInput(): [ string, string, number ] | void
    {
        const enteredTitle = this.titleElement.value;
        const enteredDescription = this.descriptionElement.value;
        const enteredPeople = this.peopleElement.value;

        const titleValidation: Validate.Validation = {
            value: enteredTitle,
            required: true
        };

        const descriptionValidation: Validate.Validation = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };

        const peopleValidation: Validate.Validation = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };

        if (!Validate.validate(titleValidation) || !Validate.validate(descriptionValidation) || !Validate.validate(peopleValidation))
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
            projectState.addProject(title, description, people)
            this.clearInputs();
        }
    }
}
