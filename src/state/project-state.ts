/**
 * RADAPLS PROJECTS
 * ------------------
 * Copyright (C) 2023 Juan Felipe Rada - All Rights Reserved.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * the express permission of Juan Felipe Rada.
 *
 * @file project-state.ts
 * @author Juan Felipe Rada <radapls8@gmail.com>
 * @date Monday, 6th March 2023
 */

import { Project, ProjectStatus } from "../models/project.model";

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

export class ProjectState extends State<Project>
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
        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus)
    {
        const project = this.projects.find(project => project.id === projectId);
        if (project && project.status !== newStatus)
        {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    updateListeners()
    {
        for (const listenerFn of this.listeners)
        {
            listenerFn(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();
