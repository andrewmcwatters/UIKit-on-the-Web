// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
// https://developer.apple.com/documentation/uikit/uitabbaritem
// Create a class for the element
class UITabBarItem extends UIBarItem {
  static get observedAttributes() { return ['title', 'href']; }

  connectedCallback() {
    this.draw();
    this.initializeStyles();
  }

  initializeStyles() {
    const href = this.getAttribute('href');
    const url  = new URL(href, document.baseURI);
    if (url.href !== location.href) {
      this.shadowRoot.querySelector('a #symbol').style.color = '#999999';
      this.shadowRoot.querySelector('a #title ').style.color = '#999999';
    } else {
      this.shadowRoot.querySelector('a').style.pointerEvents = 'none';
    }
  }

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
    display: block;
    text-decoration: none;
    -webkit-touch-callout: none;
  }

  #symbol {
    padding-top: 7px;
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
    padding-bottom: 2px;
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

  a:any-link #symbol, a:any-link #title {
    color: var(--apple-system-blue);
    color: -apple-system-blue;
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
customElements.define('apple-uitabbaritem', UITabBarItem);
