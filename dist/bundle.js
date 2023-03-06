var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("decorators/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AutoBind = void 0;
    function AutoBind(_, _2, descriptor) {
        const originalMethod = descriptor.value;
        const adjustedDescriptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            }
        };
        return adjustedDescriptor;
    }
    exports.AutoBind = AutoBind;
});
define("models/project.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project-state", ["require", "exports", "models/project.model"], function (require, exports, project_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }
        addProject(title, description, numOfPeople) {
            const newProject = new project_model_1.Project(Math.random().toString(), title, description, numOfPeople, project_model_1.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find(project => project.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }
    exports.ProjectState = ProjectState;
    exports.projectState = ProjectState.getInstance();
});
define("utils/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
    function validate(validInput) {
        let isValid = true;
        if (validInput.required) {
            isValid = isValid && validInput.value.toString().trim().length !== 0;
        }
        if (validInput.minLength != null && typeof validInput.value === 'string') {
            isValid = isValid && validInput.value.length >= validInput.minLength;
        }
        if (validInput.maxLength != null && typeof validInput.value === 'string') {
            isValid = isValid && validInput.value.length <= validInput.maxLength;
        }
        if (validInput.min != null && typeof validInput.value === 'number') {
            isValid = isValid && validInput.value >= validInput.min;
        }
        if (validInput.max != null && typeof validInput.value === 'number') {
            isValid = isValid && validInput.value <= validInput.max;
        }
        return isValid;
    }
    exports.validate = validate;
});
define("components/base-component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
    class Component {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            const importedContent = document.importNode(this.templateElement.content, true);
            this.element = importedContent.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtBeginning) {
            this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    exports.Component = Component;
});
define("components/project-input", ["require", "exports", "decorators/autobind", "state/project-state", "utils/validation", "components/base-component"], function (require, exports, autobind_1, project_state_1, validation_1, base_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends base_component_1.Component {
        constructor() {
            super('project-input', 'app', true, 'user-input');
            this.titleElement = this.element.querySelector('#title');
            this.descriptionElement = this.element.querySelector('#description');
            this.peopleElement = this.element.querySelector('#people');
            this.configure();
        }
        configure() {
            this.element.addEventListener('submit', this.handleSubmit);
        }
        renderContent() { }
        gatherUserInput() {
            const enteredTitle = this.titleElement.value;
            const enteredDescription = this.descriptionElement.value;
            const enteredPeople = this.peopleElement.value;
            const titleValidation = {
                value: enteredTitle,
                required: true
            };
            const descriptionValidation = {
                value: enteredDescription,
                required: true,
                minLength: 5
            };
            const peopleValidation = {
                value: +enteredPeople,
                required: true,
                min: 1,
                max: 5
            };
            if (!(0, validation_1.validate)(titleValidation) || !(0, validation_1.validate)(descriptionValidation) || !(0, validation_1.validate)(peopleValidation)) {
                alert('Invalid Input, please try again!');
                return;
            }
            else {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        }
        clearInputs() {
            this.titleElement.value = '';
            this.descriptionElement.value = '';
            this.peopleElement.value = '';
        }
        handleSubmit(event) {
            event.preventDefault();
            const userInput = this.gatherUserInput();
            if (Array.isArray(userInput)) {
                const [title, description, people] = userInput;
                project_state_1.projectState.addProject(title, description, people);
                this.clearInputs();
            }
        }
    }
    __decorate([
        autobind_1.AutoBind
    ], ProjectInput.prototype, "handleSubmit", null);
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop.interface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "decorators/autobind", "components/base-component"], function (require, exports, autobind_2, base_component_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    class ProjectItem extends base_component_2.Component {
        get persons() {
            if (this.project.people === 1) {
                return '1 Person';
            }
            else {
                return `${this.project.people} Persons`;
            }
        }
        constructor(hostId, project) {
            super('single-project', hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndHandler(_) {
            console.log(_);
        }
        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = this.persons + ' assigned';
            this.element.querySelector('p').textContent = this.project.description;
        }
    }
    __decorate([
        autobind_2.AutoBind
    ], ProjectItem.prototype, "dragStartHandler", null);
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "decorators/autobind", "models/project.model", "state/project-state", "components/base-component", "components/project-item"], function (require, exports, autobind_3, project_model_2, project_state_2, base_component_3, project_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    class ProjectList extends base_component_3.Component {
        constructor(type) {
            super('project-list', 'app', false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listElement = this.element.querySelector('ul');
                listElement.classList.add('droppable');
            }
        }
        dropHandler(event) {
            const projectId = event.dataTransfer.getData('text/plain');
            project_state_2.projectState.moveProject(projectId, this.type === 'active' ? project_model_2.ProjectStatus.Active : project_model_2.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const listElement = this.element.querySelector('ul');
            listElement.classList.remove('droppable');
        }
        renderContent() {
            const listID = `${this.type}-projects-list`;
            this.element.querySelector('ul').id = listID;
            this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        }
        configure() {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);
            project_state_2.projectState.addListener((projects) => {
                const relevantProjects = projects.filter(project => {
                    if (this.type === 'active') {
                        return project.status === project_model_2.ProjectStatus.Active;
                    }
                    else {
                        return project.status === project_model_2.ProjectStatus.Finished;
                    }
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderProjects() {
            const listElement = document.getElementById(`${this.type}-projects-list`);
            listElement.innerHTML = '';
            for (const item of this.assignedProjects) {
                new project_item_1.ProjectItem(this.element.querySelector('ul').id, item);
            }
        }
    }
    __decorate([
        autobind_3.AutoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_3.AutoBind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind_3.AutoBind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_1, project_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new project_input_1.ProjectInput();
    new project_list_1.ProjectList('active');
    new project_list_1.ProjectList('finished');
});
//# sourceMappingURL=bundle.js.map