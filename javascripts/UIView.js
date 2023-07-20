// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
// https://developer.apple.com/documentation/uikit/uiview
class UIView extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    /* const shadow = */ this.attachShadow({mode: 'open'});
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.draw();
  }

  connectedCallback() {
    this.draw();
  }

  draw() {
    const shadow = this.shadowRoot;

    shadow.innerHTML = `<slot></slot>`;
  }
}

// Define the new element
customElements.define('x-uiview', UIView);
