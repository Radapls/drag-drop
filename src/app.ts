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

/// <reference path="drag-drop.interfaces.ts" />
/// <reference path="project-module.ts" />
/// <reference path="project-state.ts" />
/// <reference path="project-module.ts" />
/// <reference path="validation.ts" />
/// <reference path="autobind-decorator.ts" />

namespace App
{

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
    class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable
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

        @AutoBind
        dragStartHandler(event: DragEvent): void
        {
            event.dataTransfer!.setData('text/plain', this.project.id);
            event.dataTransfer!.effectAllowed = 'move';
        }

        dragEndHandler(_: DragEvent): void
        {
            console.log('dragEnd');
        }

        configure(): void
        {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }

        renderContent(): void
        {
            this.element.querySelector('h2')!.textContent = this.project.title;
            this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
            this.element.querySelector('p')!.textContent = this.project.description;
        }
    }

    /** ProjectList Class */
    class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget
    {
        assignedProjects: Project[];

        constructor(private type: 'active' | 'finished')
        {
            super('project-list', 'app', false, `${type}-projects`);
            this.assignedProjects = [];

            this.configure();
            this.renderContent();
        }

        @AutoBind
        dragOverHandler(event: DragEvent): void
        {
            if (event.dataTransfer && event.dataTransfer.types[ 0 ] === 'text/plain')
            {
                event.preventDefault();
                const listElement = this.element.querySelector('ul')!;
                listElement.classList.add('droppable');
            }

        }

        @AutoBind
        dropHandler(event: DragEvent): void
        {
            const projectId = event.dataTransfer!.getData('text/plain');
            projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
        }

        @AutoBind
        dragLeaveHandler(_: DragEvent): void
        {
            const listElement = this.element.querySelector('ul')!;
            listElement.classList.remove('droppable');
        }

        renderContent()
        {
            const listID = `${this.type}-projects-list`;
            this.element.querySelector('ul')!.id = listID;
            this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
        }

        configure(): void
        {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);

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

    new ProjectInput();
    new ProjectList('active')
    new ProjectList('finished')
}
