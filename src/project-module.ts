/**
 * RADAPLS PROJECTS
 * ------------------
 * Copyright (C) 2023 Juan Felipe Rada - All Rights Reserved.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * the express permission of Juan Felipe Rada.
 *
 * @file project-module.ts
 * @author Juan Felipe Rada <radapls8@gmail.com>
 * @date Monday, 6th March 2023
 */

namespace App
{
    /** Project Type */

    export enum ProjectStatus
    {
        Active, Finished
    }

    export class Project
    {
        constructor(
            public id: string,
            public title: string,
            public description: string,
            public people: number,
            public status: ProjectStatus)
        { }
    }
}
