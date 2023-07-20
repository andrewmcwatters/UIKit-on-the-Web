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

  draw() {}
}
