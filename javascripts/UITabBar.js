// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
// https://developer.apple.com/documentation/uikit/uitabbar
// Create a class for the element
class UITabBar extends UIView {
  constructor() {
    // Always call super first in constructor
    super();

    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners
    /* Feature detection */
    let passiveIfSupported = false;

    try {
      window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", {
          get() {
            passiveIfSupported = { passive: true };
          },
        }),
      );
    } catch (err) {}

    // handleScroll
    this.handleScroll = this.handleScroll.bind(this);
    document.addEventListener('scroll', this.handleScroll, passiveIfSupported);
  }

  connectedCallback() {
    this.draw();
    this.initializeStyles();
  }

  handleScroll(event) {
    // Fade out background, box-shadow, and backdrop-filter if we scroll past
    // the view
    //
    // See also: UINavigationBar.handleScroll()
    const view       = document.querySelector('apple-uiview');
    const viewStyle  = getComputedStyle(view);
    const background = this.shadowRoot.querySelector('#background');

    const bottom     = scrollY + innerHeight;
    let offsetHeight = view.offsetHeight;
    offsetHeight     = offsetHeight + parseFloat(viewStyle.marginBottom);

    if (bottom >= offsetHeight - 9) {
      // offsetHeight   = offsetHeight + 9;
      // const clamp    = (n, min, max) => Math.max(min, Math.min(n, max));
      // const percent  = 1 - clamp((bottom - offsetHeight + 9) / 9, 0, 1);
      const percent  = 1 - Math.max(0, Math.min((bottom - offsetHeight + 9) / 9, 1));

      background.style.background = '';
      const backgroundStyle       = getComputedStyle(background);
      const backgroundColor       = backgroundStyle
        .backgroundColor
        .replace('0.8',  `calc(0.8  * ${percent})`);
      background.style.background = backgroundColor;

      background.style.boxShadow  = '';
      let boxShadow = backgroundStyle
        .boxShadow
        .replace('0.3',  `calc(0.3  * ${percent})`);
      boxShadow = boxShadow
        .replace('0.16', `calc(0.16 * ${percent})`);
      background.style.boxShadow  = boxShadow;
    } else {
      background.style.background           = '';
      background.style.boxShadow            = '';
      background.style.backdropFilter       = '';
      background.style.webkitBackdropFilter = '';
    }
  }

  initializeStyles() {
    // Set #background rgb background to transparent and remove box-shadow and
    // backdrop filter
    const view       = document.querySelector('apple-uiview');
    const background = this.shadowRoot.querySelector('#background');

    if (view.offsetHeight <= innerHeight - background.offsetHeight) {
      background.style.background           = 'transparent';
      background.style.boxShadow            = 'none';
      background.style.backdropFilter       = 'none';
      background.style.webkitBackdropFilter = 'none';
    }

    requestAnimationFrame(() => {
      const view = document.querySelector('apple-uiview');
      view.style.marginBottom = background.offsetHeight + 'px';
    });
  }

  draw() {
    const shadow = this.shadowRoot;

    shadow.innerHTML = /* html */`<style>
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
    -webkit-backdrop-filter: blur(20px) saturate(100%);
  }

  @media (prefers-color-scheme: dark) {
    #background {
      background: rgba(22,22,22,0.80);
      box-shadow: 0 -0.5px 0 0 rgba(255,255,255,0.16);
      backdrop-filter: blur(20px) saturate(30%);
      -webkit-backdrop-filter: blur(20px) saturate(30%);
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
customElements.define('apple-uitabbar', UITabBar);
