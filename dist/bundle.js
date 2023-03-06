"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
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
            const newProject = new App.Project(Math.random().toString(), title, description, numOfPeople, App.ProjectStatus.Active);
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
    App.ProjectState = ProjectState;
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
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
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
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
    App.AutoBind = AutoBind;
})(App || (App = {}));
var App;
(function (App) {
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
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectInput extends App.Component {
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
            if (!App.validate(titleValidation) || !App.validate(descriptionValidation) || !App.validate(peopleValidation)) {
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
                App.projectState.addProject(title, description, people);
                this.clearInputs();
            }
        }
    }
    __decorate([
        App.AutoBind
    ], ProjectInput.prototype, "handleSubmit", null);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.Component {
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
            console.log('dragEnd');
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
        App.AutoBind
    ], ProjectItem.prototype, "dragStartHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.Component {
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
            App.projectState.moveProject(projectId, this.type === 'active' ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
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
            App.projectState.addListener((projects) => {
                const relevantProjects = projects.filter(project => {
                    if (this.type === 'active') {
                        return project.status === App.ProjectStatus.Active;
                    }
                    else {
                        return project.status === App.ProjectStatus.Finished;
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
                new App.ProjectItem(this.element.querySelector('ul').id, item);
            }
        }
    }
    __decorate([
        App.AutoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.AutoBind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.AutoBind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    new App.ProjectInput();
    new App.ProjectList('active');
    new App.ProjectList('finished');
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map