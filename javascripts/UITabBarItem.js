// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
// https://developer.apple.com/documentation/uikit/uitabbaritem
// Create a class for the element
class UITabBarItem extends UIView {
  static get observedAttributes() { return ['label']; }

  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    /* const shadow = */ this.attachShadow({mode: 'open'});
    this.draw();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.draw();
  }

  draw() {
    const shadow = this.shadowRoot;
    const label  = this.getAttribute('label');

    shadow.innerHTML = 
`<style>
  #root {
    min-width: 48px;
    min-height: 49px;
  }

  #symbol {
    margin-top: 7px;
    /* font-family: SFPro-Medium; */
    font-weight: 500;
    font-size: 18px;
    color: #000000;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    #symbol {
      color: #FFFFFF;
    }
  }

  #label {
    margin-bottom: 2px;
    /* font-family: SFPro-Medium; */
    font-weight: 500;
    font-size: 10px;
    color: #000000;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    #label {
      color: #FFFFFF;
    }
  }
</style>
<div id="root">
  <div id="symbol">
    ★
  </div>
  <div id="label">
    ${label}
  </div>
</div>`;
  }
}

// Define the new element
customElements.define('x-uitabbaritem', UITabBarItem);
