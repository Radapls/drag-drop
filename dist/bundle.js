(()=>{"use strict";function e(e,t,n){const r=n.value;return{configurable:!0,get(){return r.bind(this)}}}var t;!function(e){e[e.Active=0]="Active",e[e.Finished=1]="Finished"}(t||(t={}));class n{constructor(e,t,n,r,s){this.id=e,this.title=t,this.description=n,this.people=r,this.status=s}}class r{constructor(){this.listeners=[]}addListener(e){this.listeners.push(e)}}class s extends r{constructor(){super(),this.projects=[]}static getInstance(){return this.instance||(this.instance=new s),this.instance}addProject(e,r,s){const i=new n(Math.random().toString(),e,r,s,t.Active);this.projects.push(i),this.updateListeners()}moveProject(e,t){const n=this.projects.find((t=>t.id===e));n&&n.status!==t&&(n.status=t,this.updateListeners())}updateListeners(){for(const e of this.listeners)e(this.projects.slice())}}const i=s.getInstance();function l(e){let t=!0;return e.required&&(t=t&&0!==e.value.toString().trim().length),null!=e.minLength&&"string"==typeof e.value&&(t=t&&e.value.length>=e.minLength),null!=e.maxLength&&"string"==typeof e.value&&(t=t&&e.value.length<=e.maxLength),null!=e.min&&"number"==typeof e.value&&(t=t&&e.value>=e.min),null!=e.max&&"number"==typeof e.value&&(t=t&&e.value<=e.max),t}class o{constructor(e,t,n,r){this.templateElement=document.getElementById(e),this.hostElement=document.getElementById(t);const s=document.importNode(this.templateElement.content,!0);this.element=s.firstElementChild,r&&(this.element.id=r),this.attach(n)}attach(e){this.hostElement.insertAdjacentElement(e?"afterbegin":"beforeend",this.element)}}class a extends o{constructor(){super("project-input","app",!0,"user-input"),this.titleElement=this.element.querySelector("#title"),this.descriptionElement=this.element.querySelector("#description"),this.peopleElement=this.element.querySelector("#people"),this.configure()}configure(){this.element.addEventListener("submit",this.handleSubmit)}renderContent(){}gatherUserInput(){const e=this.titleElement.value,t=this.descriptionElement.value,n=this.peopleElement.value,r={value:t,required:!0,minLength:5},s={value:+n,required:!0,min:1,max:5};return l({value:e,required:!0})&&l(r)&&l(s)?[e,t,+n]:void alert("Invalid Input, please try again!")}clearInputs(){this.titleElement.value="",this.descriptionElement.value="",this.peopleElement.value=""}handleSubmit(e){e.preventDefault();const t=this.gatherUserInput();if(Array.isArray(t)){const[e,n,r]=t;i.addProject(e,n,r),this.clearInputs()}}}!function(e,t,n,r){var s,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(l=(i<3?s(l):i>3?s(t,n,l):s(t,n))||l);i>3&&l&&Object.defineProperty(t,n,l)}([e],a.prototype,"handleSubmit",null);class c extends o{get persons(){return 1===this.project.people?"1 Person":`${this.project.people} Persons`}constructor(e,t){super("single-project",e,!1,t.id),this.project=t,this.configure(),this.renderContent()}dragStartHandler(e){e.dataTransfer.setData("text/plain",this.project.id),e.dataTransfer.effectAllowed="move"}dragEndHandler(e){console.log(e)}configure(){this.element.addEventListener("dragstart",this.dragStartHandler),this.element.addEventListener("dragend",this.dragEndHandler)}renderContent(){this.element.querySelector("h2").textContent=this.project.title,this.element.querySelector("h3").textContent=this.persons+" assigned",this.element.querySelector("p").textContent=this.project.description}}!function(e,t,n,r){var s,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(l=(i<3?s(l):i>3?s(t,n,l):s(t,n))||l);i>3&&l&&Object.defineProperty(t,n,l)}([e],c.prototype,"dragStartHandler",null);var d=function(e,t,n,r){var s,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(l=(i<3?s(l):i>3?s(t,n,l):s(t,n))||l);return i>3&&l&&Object.defineProperty(t,n,l),l};class h extends o{constructor(e){super("project-list","app",!1,`${e}-projects`),this.type=e,this.assignedProjects=[],this.configure(),this.renderContent()}dragOverHandler(e){e.dataTransfer&&"text/plain"===e.dataTransfer.types[0]&&(e.preventDefault(),this.element.querySelector("ul").classList.add("droppable"))}dropHandler(e){const n=e.dataTransfer.getData("text/plain");i.moveProject(n,"active"===this.type?t.Active:t.Finished)}dragLeaveHandler(e){this.element.querySelector("ul").classList.remove("droppable")}renderContent(){const e=`${this.type}-projects-list`;this.element.querySelector("ul").id=e,this.element.querySelector("h2").textContent=this.type.toUpperCase()+" PROJECTS"}configure(){this.element.addEventListener("dragover",this.dragOverHandler),this.element.addEventListener("dragleave",this.dragLeaveHandler),this.element.addEventListener("drop",this.dropHandler),i.addListener((e=>{const n=e.filter((e=>"active"===this.type?e.status===t.Active:e.status===t.Finished));this.assignedProjects=n,this.renderProjects()}))}renderProjects(){document.getElementById(`${this.type}-projects-list`).innerHTML="";for(const e of this.assignedProjects)new c(this.element.querySelector("ul").id,e)}}d([e],h.prototype,"dragOverHandler",null),d([e],h.prototype,"dropHandler",null),d([e],h.prototype,"dragLeaveHandler",null),new a,new h("active"),new h("finished")})();