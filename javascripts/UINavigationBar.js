// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
// https://developer.apple.com/documentation/uikit/uinavigationbar
// Create a class for the element
class UINavigationBar extends UIView {
  static get observedAttributes() { return ['title', 'preferslargetitle']; }

  draw() {
    const shadow            = this.shadowRoot;
    const title             = this.getAttribute('title');
    const prefersLargeTitle = this.getAttribute('preferslargetitle');

    shadow.innerHTML = 
`<style>
  #background {
    padding-top: env(safe-area-inset-top);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    min-height: 44px;
    background: rgba(249,249,249,0.94);
    box-shadow: 0 0.33px 0 0 rgba(0,0,0,0.30);
    -webkit-backdrop-filter: blur(20px) saturate(100%);
    backdrop-filter: blur(20px) saturate(100%);
  }

  @media (prefers-color-scheme: dark) {
    #background {
      background: rgba(29,29,29,0.94);
      box-shadow: 0 0.33px 0 0 rgba(255,255,255,0.15);
      -webkit-backdrop-filter: blur(20px) saturate(30%);
      backdrop-filter: blur(20px) saturate(30%);
    }
  }

  #background > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #controls-left, #controls-right {
    display: flex;
    min-width: 44px;
    min-height: 44px;
    justify-content: center;
    align-items: center;
  }

  #controls-left {
    margin-left: 8px;
  }

  #controls-right {
    margin-right: 8px;
  }

  #title {
    /* font-family: SFPro-Semibold; */
    font-weight: 600;
    font-size: 17px;
    color: #000000;
    text-align: center;
    line-height: 22px;
  }

  @media (prefers-color-scheme: dark) {
    #title {
      color: #FFFFFF;
    }
  }

  #title-large {
    /* font-family: SFPro-Bold; */
    font-weight: 700;
    font-size: 34px;
    color: #000000;
    line-height: 41px;
    margin-right: 16px;
    margin-left: 16px;
    padding-top: 4px;
    padding-bottom: 7px;
  }

  @media (prefers-color-scheme: dark) {
    #title-large {
      color: #FFFFFF;
    }
  }
</style>
<div id="background">
  <div>
    <div id="controls-left"></div>
    <div id="title">${prefersLargeTitle ? '' : title}</div>
    <div id="controls-right"></div>
  </div>
  <!-- ${prefersLargeTitle ? `<div id="title-large">${title}</div>` : ''} -->
</div>`;
  }
}

// Define the new element
customElements.define('x-uinavigationbar', UINavigationBar);
