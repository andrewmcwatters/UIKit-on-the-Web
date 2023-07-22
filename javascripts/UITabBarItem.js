// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
// https://developer.apple.com/documentation/uikit/uitabbaritem
// Create a class for the element
class UITabBarItem extends UIBarItem {
  static get observedAttributes() { return ['title', 'href']; }

  draw() {
    const shadow = this.shadowRoot;
    const title  = this.getAttribute('title');
    const href   = this.getAttribute('href');

    shadow.innerHTML = /* html */`<style>
  :host {
    min-width: 48px;
    min-height: 49px;
    user-select: none;
    -webkit-user-select: none;
  }

  a {
    text-decoration: none;
    -webkit-touch-callout: none;
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

  #title {
    margin-bottom: 2px;
    /* font-family: SFPro-Medium; */
    font-weight: 500;
    font-size: 10px;
    color: #000000;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    #title {
      color: #FFFFFF;
    }
  }

  a:any-link * {
    color: var(--apple-system-blue) !important;
    color: -apple-system-blue !important;
  }
</style>
<a${title ? ` title="${title}"` : ''}${href ? ` href="${href}"` : ''}>
  <div id="symbol">
    <slot></slot>
  </div>
  <div id="title">${title}</div>
</a>`;
  }
}

// Define the new element
customElements.define('x-uitabbaritem', UITabBarItem);
