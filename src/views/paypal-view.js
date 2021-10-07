import { LitElement, html, css } from "lit-element";
import "@vaadin/vaadin-text-field/vaadin-password-field.js";

let buttons;
let hasRendered = false;

class PaypalElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      mood: {
        type: String,
        noAccessor: false,
        hasChanged(newVal, oldVal) {
          console.log("newVal " + newVal + " oldVal " + oldVal);
        },
      },
    };
  }

  static get styles() {
    return [
      css`
        mood_color {
          color: green;
        }
        .pred {
          color: red;
        }
        #paypal-button {
          size: "responsive";
        }
      `,
    ];
  }

  firstUpdated(_changedProperties) {
    let testFname = this.shadowRoot.getElementById("fname");
    super.firstUpdated(_changedProperties);

    if (buttons && buttons.close && hasRendered) {
      buttons.close();
      hasRendered = false;
    }
    buttons = window.paypal.Buttons({
      // Set up the transaction
      createOrder: function (data, actions) {
        return actions.order.create({
          application_context: {
            brand_name: "Brand name",
            user_action: "PAY_NOW",
            //No shipping for in-tangible merchant
            shipping_preference: "NO_SHIPPING",
            payment_method: {
              payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED", // Pending status transactions will not be allowed if you pass this parameter.
              payer_selected: "PAYPAL",
            },
          },
          purchase_units: [
            {
              soft_descriptor: "CC_STATEMENT_NAME",
              amount: {
                value: "5.00",
              },
            },
          ],
        });
      },

      // Finalize the transaction
      onApprove: function (data, actions) {
        const elementText = document.getElementById("fname");

        return actions.order.capture().then(function (orderData) {
          // Successful capture! For demo purposes:
          console.log(
            "Capture result",
            orderData,
            JSON.stringify(orderData, null, 2)
          );

          let transaction = orderData.purchase_units[0].payments.captures[0];

          // Replace the above to show a success message within this page, e.g.
          // const element = document.getElementById('paypal-button-container');
          // element.innerHTML = '';
          // element.innerHTML = '<h3>Thank you for your payment!</h3>';
          // Or go to another URL:  actions.redirect('thank_you.html');
          document.getElementById("update-paypal-trans").innerHTML =
            "update-paypal-trans = " + transaction.id;

          // trigger lit event
          testFname.value = transaction.id;
          testFname.click();

          document.getElementById("paypalelement").remove();
          //console.log(elementText);
        });
      },

      onError: function (error) {
        console.log("onError", error, JSON.stringify(error, null, 2));
      },

      onCancel: function (data, actions) {
        console.log("onCancel", data, JSON.stringify(data, null, 2));

        document.getElementById("update-paypal-trans").innerHTML =
          "testing 123";

        // update shadow element
        testFname.value = "12345 " + actions;
        // trigger lit event
        testFname.click();
      },
    });

    // load paypal buttons and put them to element id="paypal-button-to-display" which is shadow dom
    buttons
      .render(this.shadowRoot.getElementById("paypal-button-to-display"))
      .then(() => {
        hasRendered = true;
      })
      .catch((err) => {
        console.log(err);
        return;
      });

  }

  // outside updates shadow element
  updateShadow() {
    this.shadowRoot.getElementById("test-update-shadow").innerHTML =
      "test update shadow trans";
    this.mood = "nice";
  }

  updateTask(e) {
    console.log("updateTask: " + e);
  }

  updateTaskClick(e) {
    console.log("updateTaskClick: " + e);
    // call back-end
  }

  _handleInputKeydown(e) {
    console.log("_handleInputKeydown: " + e);
  }

  render() {
    return html`
      <div class="pred">hello test css</div>
      <br />
      Web Components are
      <span class="mood_color"> ${this.mood} and ${this.innerHTML}</span>!
      <input
        type="text"
        id="fname"
        name="fname"
        value="${this.mood}"
        @change=${(e) => this.updateTask(e.target.value)}
        @click="${(e) => this.updateTaskClick(e.target.value)}"
      />
      <div id="paypal-button-to-display"></div>
      <br />
      <div id="test-update-shadow">test-update-shadow-default</div>
      <br />
      <input
        @click="${() => this.updateShadow()}"
        id="myinput"
        type="button"
        value="update shadow button"
      />
      <br />
      <vaadin-password-field
        id="textPassword"
        theme="theme-password-field-label"
        label="Password"
        required
        on-keydown="${(e) => this._handleInputKeydown(e.target.value)}"
        class="main-screen-hori-layout-row-text"
      >
        <input name="password" type="password" slot="input" />
      </vaadin-password-field>
    `;
  }

  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    console.log("attribute change: ", name, newval);
  }

  changeProperties() {
    let randomString = Math.floor(Math.random() * 100).toString();
    this.mood = "myProp " + randomString;
    console.log("randomString change: ", randomString);
  }
}

customElements.define("paypal-element", PaypalElement);
