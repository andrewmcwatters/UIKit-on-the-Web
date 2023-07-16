// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
// https://developer.apple.com/documentation/uikit/uitabbar
// Create a class for the element
class UITabBar extends UIView {
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

    shadow.innerHTML = 
`<style>
  #background {
    padding-bottom: env(safe-area-inset-bottom);
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    min-height: 44px;
    background: rgba(247,247,247,0.80);
    box-shadow: 0 -0.5px 0 0 rgba(0,0,0,0.30);
    backdrop-filter: blur(20px) saturate(100%);
  }

  @media (prefers-color-scheme: dark) {
    #background {
      background: rgba(22,22,22,0.80);
      box-shadow: 0 -0.5px 0 0 rgba(255,255,255,0.16);
      backdrop-filter: blur(20px) saturate(30%);
    }
  }

  #background > div {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
</style>
<div id="background">
  <div>
    <slot></slot>
  </div>
</div>`;
  }
}

// Define the new element
customElements.define('x-uitabbar', UITabBar);
