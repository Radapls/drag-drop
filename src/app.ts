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

/** Project Type */

enum ProjectStatus
{
    Active, Finished
}

class Project
{
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus)
    { }
}

/** Project state management */

type Listener<T> = (items: T[]) => void;

class State<T>
{
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>)
    {
        this.listeners.push(listenerFn);
    }
}

class ProjectState extends State<Project>
{
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor()
    {
        super();
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


    addProject(title: string, description: string, numOfPeople: number)
    {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active)

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

/** Base Class */
abstract class Component<T extends HTMLElement, U extends HTMLElement>
{
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
        templateId: string,
        hostElementId: string,
        insertAtStart: boolean,
        newElementId?: string
    )
    {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const importedContent = document.importNode(this.templateElement.content, true);
        this.element = importedContent.firstElementChild as U;

        if (newElementId)
        {
            this.element.id = newElementId;
        }

        this.attach(insertAtStart);
    }

    private attach(insertAtBeginning: boolean)
    {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }

    abstract configure(): void;
    abstract renderContent(): void;

}

/** Project Item Class */
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
{
    private project: Project;

    get persons()
    {
        if (this.project.people === 1)
        {
            return '1 Person';
        } else
        {
            return `${this.project.people} Persons`
        }
    }

    constructor(hostId: string, project: Project)
    {
        super('single-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure(): void
    {

    }

    renderContent(): void
    {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}

/** ProjectList Class */
class ProjectList extends Component<HTMLDivElement, HTMLElement>
{
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished')
    {
        super('project-list', 'app', false, `${type}-projects`);
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    renderContent()
    {
        const listID = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listID;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    configure(): void
    {
        projectState.addListener((projects: Project[]) =>
        {
            const relevantProjects = projects.filter(project =>
            {
                if (this.type === 'active')
                {
                    return project.status === ProjectStatus.Active
                } else
                {
                    return project.status === ProjectStatus.Finished
                }
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    private renderProjects()
    {
        const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listElement.innerHTML = '';
        for (const item of this.assignedProjects)
        {
            new ProjectItem(this.element.querySelector('ul')!.id, item);
        }
    }
}


class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>
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
            projectState.addProject(title, description, people)
            this.clearInputs();
        }
    }
}

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')
