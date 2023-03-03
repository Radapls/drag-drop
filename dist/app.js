"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedContent = document.importNode(this.templateElement.content, true);
        this.element = importedContent.firstElementChild;
        this.element.id = 'user-input';
        this.titleElement = this.element.querySelector('#title');
        this.descriptionElement = this.element.querySelector('#description');
        this.peopleElement = this.element.querySelector('#people');
        this.configure();
        this.attach();
    }
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
        if (!validate(titleValidation) || !validate(descriptionValidation) || !validate(peopleValidation)) {
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
            console.log(title, description, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener('submit', this.handleSubmit);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    AutoBind
], ProjectInput.prototype, "handleSubmit", null);
const prjInput = new ProjectInput();
//# sourceMappingURL=app.js.map