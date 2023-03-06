/**
 * RADAPLS PROJECTS
 * ------------------
 * Copyright (C) 2023 Juan Felipe Rada - All Rights Reserved.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * the express permission of Juan Felipe Rada.
 *
 * @file autobind.ts
 * @author Juan Felipe Rada <radapls8@gmail.com>
 * @date Monday, 6th March 2023
 */

namespace App
{
    /** Auto-bind decorator */
    export function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor)
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
}