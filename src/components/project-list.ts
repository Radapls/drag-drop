/**
 * RADAPLS PROJECTS
 * ------------------
 * Copyright (C) 2023 Juan Felipe Rada - All Rights Reserved.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * the express permission of Juan Felipe Rada.
 *
 * @file project-list.ts
 * @author Juan Felipe Rada <radapls8@gmail.com>
 * @date Monday, 6th March 2023
 */

import { AutoBind } from "../decorators/autobind";
import { DragTarget } from "../models/drag-drop.interface";
import { Project, ProjectStatus } from "../models/project.model";
import { projectState } from "../state/project-state";
import Component from "./base-component";
import { ProjectItem } from "./project-item";

/** ProjectList Class */
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget
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
