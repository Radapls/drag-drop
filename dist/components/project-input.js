var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AutoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import * as Validate from "../utils/validation.js";
import Component from "./base-component.js";
export class ProjectInput extends Component {
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
        if (!Validate.validate(titleValidation) || !Validate.validate(descriptionValidation) || !Validate.validate(peopleValidation)) {
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
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }
}
__decorate([
    AutoBind
], ProjectInput.prototype, "handleSubmit", null);
//# sourceMappingURL=project-input.js.map