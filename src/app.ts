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

/// <reference path="./models/drag-drop.interface.ts" />
/// <reference path="./models/project.model.ts" />
/// <reference path="./state/project-state.ts" />
/// <reference path="./models/project.model.ts" />
/// <reference path="./utils/validation.ts" />
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./components/base-component.ts" />
/// <reference path="./components/project-input.ts" />
/// <reference path="./components/project-item.ts" />
/// <reference path="./components/project-list.ts" />


namespace App
{

    new ProjectInput();
    new ProjectList('active')
    new ProjectList('finished')
}
