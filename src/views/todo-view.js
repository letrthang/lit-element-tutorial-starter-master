import { LitElement, html } from "lit-element";

const VisibilityFilters = {
  SHOW_ALL: "All",
  SHOW_ACTIVE: "Active",
  SHOW_COMPLETED: "Completed",
};

function testfunc() {
  //window.alert(this.shadowRoot.getElementById("map").textContent)
  //window.alert(this.shadowRoot.querySelector("#myId").textContent);
  this.shadowRoot.querySelector("#myId").textContent = "querySelector 1111";
}

class TodoViewElement extends LitElement {
  static get properties() {
    return {
      todos: {
        type: Array,
        hasChanged(newVal, oldVal) {
          window.alert(newVal);
        },
      },
      filter: {
        type: String,
        hasChanged(newVal, oldVal) {
          window.alert(newVal);
        },
      },
      task: {
        type: String,
        hasChanged(newVal, oldVal) {
          window.alert("new value:" + newVal);
        },
      },
    };
  }

  constructor() {
    super();
    this.todos = [];
    this.filter = VisibilityFilters.SHOW_ALL;
    this.task = "task 1";
  }

  addTodo(param) {
    window.alert(this.task + " - " + param);
    //testfunc();
    this.shadowRoot.querySelector("#myId").textContent =
      "querySelector testing";
  }

  updateTask(task) {
    this.task = task;
  }

  render() {
    return html` <p>todo-view-element-example</p>
      <br />
      <div id="myId" value="map value">map value 2</div>
      <br />
      <input
        @click="${() => this.addTodo()}"
        id="myinput"
        type="button"
        value="my button"
      />
      <br />
      <input
        value="${this.task}"
        id="myinput"
        type="text"
        @change=${(e) => this.updateTask(e.target.value)}
      />`;
  }
}

customElements.define("todo-view-element", TodoViewElement);
