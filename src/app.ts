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

/** Project state management */
class ProjectState
{
    private listeners: any[] = [];
    private projects: any[] = [];
    private static instance: ProjectState;

    private constructor()
    {
    }

    static getInstance()
    {
        if (this.instance)
        {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Function)
    {
        this.listeners.push(listenerFn);
    }

    addPRoject(title: string, description: string, numOfPeople: number)
    {
        const newProject = {
            id: Math.random().toString(),
            title,
            description,
            numOfPeople
        };

        this.projects.push(newProject);
        for (const listenerFn of this.listeners)
        {
            listenerFn(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();

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


/** ProjectList Class */
class ProjectList
{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: any[];

    constructor(private type: 'active' | 'finished')
    {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        this.assignedProjects = [];

        const importedContent = document.importNode(this.templateElement.content, true);
        this.element = importedContent.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;

        projectState.addListener((projects: any[]) =>
        {
            this.assignedProjects = projects;
            this.renderProjects();
        });

        this.attach();
        this.renderContent();
    }

    private renderProjects()
    {
        const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        for (const items of this.assignedProjects)
        {
            const listItem = document.createElement('li');
            listItem.textContent = items.title;
            listElement.appendChild(listItem)
        }
    }

    private renderContent()
    {
        const listID = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listID;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach()
    {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
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
            projectState.addPRoject(title, description, people)
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

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')
