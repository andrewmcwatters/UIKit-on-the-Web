// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
// https://developer.apple.com/documentation/uikit/uinavigationbar
// Create a class for the element
class UINavigationBar extends UIView {
  static get observedAttributes() { return ['title', 'preferslargetitle']; }

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

    const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

    document.addEventListener('scroll', (event) => {
      // Fade out large title and fade in title if we scroll past the large
      // title's baseline
      const { target }    = event;
      const titleLarge    = target.querySelector('x-uiview > #title-large');
      const background    = this.shadowRoot.querySelector('#background');

      let offsetHeight;
      let titleLargeStyle;
      let baseline;
      let descenderHeight;

      if (titleLarge) {
        const title       = this.shadowRoot.querySelector('#title');
  
        // #background offsetHeight
        ({ offsetHeight } = background);
  
        // #title-large padding-top
        titleLargeStyle   = getComputedStyle(titleLarge);
        let paddingTop    = parseFloat(titleLargeStyle.paddingTop);
  
        // #background box-shadow offset-y
        const offsetY     = parseFloat('1px');
  
        // #title-large padding-top distance from the bottom of #background,
        // including box-shadow offset-y
        paddingTop        = paddingTop - (offsetHeight + offsetY);
  
        // #title-large typographic metrics from system-ui
        const lineHeight  = parseFloat(titleLargeStyle.lineHeight);
        descenderHeight   = parseFloat('7px');
  
        baseline          = paddingTop + lineHeight - descenderHeight;

        if (window.scrollY >= baseline) {
          titleLarge.style.opacity = 0;
               title.style.opacity = 1;
        } else {
          titleLarge.style.opacity = 1;
               title.style.opacity = 0;
        }
      }

      // Fade in background and box-shadow if we scroll past the large title's
      // offsetHeight
      //
      // NOTE: Unlike #title and #title-large, these properties fade in as you
      // scroll versus using a CSS transition. These properties become visible
      // 1px past the offsetHeight, and complete transition 9px past the
      // offsetHeight. This behavior has been verified in Mail, Podcasts, and
      // the App Store.
      if (titleLarge) {
        const paddingBottom = parseFloat(titleLargeStyle.paddingBottom);
        const marginBottom  = parseFloat(titleLargeStyle.marginBottom);
        // FIXME: We're off by two pixels. This is possibly a line-height
        // anti-aliasing bounding box difference.
        offsetHeight = baseline + descenderHeight + paddingBottom + marginBottom;
        offsetHeight = offsetHeight + 2;
      } else {
        offsetHeight = 0;
      }

      if (window.scrollY > offsetHeight) {
        background.style.background = '';
        background.style.boxShadow  = '';

        let percent = clamp((window.scrollY - offsetHeight) / 9, 0, 1);

        const backgroundStyle = getComputedStyle(background);
        const backgroundColor = backgroundStyle
          .backgroundColor
          .replace('0.94', `calc(0.94 * ${percent})`);
        background.style.background = backgroundColor;

        const boxShadow = backgroundStyle
          .boxShadow
          .replace('0.3', `calc(0.3 * ${percent})`);
        background.style.boxShadow  = boxShadow;
      } else {
        background.style.background = this.calculateBackgroundColor();
        background.style.boxShadow  = 'none';
      }
    }, passiveIfSupported);
  }

  calculateBackgroundColor() {
    const body          = this.ownerDocument.body;
    let backgroundColor = getComputedStyle(body).backgroundColor;
    backgroundColor     = backgroundColor.replace('rgb', 'rgba');
    backgroundColor     = backgroundColor.replace(')', ',0.94)');
    return backgroundColor;
  }

  connectedCallback() {
    this.draw();
    this.initializeStyles();
  }

  initializeStyles() {
    const prefersLargeTitle = this.getAttribute('preferslargetitle');
    if (!prefersLargeTitle) {
      return;
    }

    // https://developer.apple.com/documentation/uikit/uinavigationbar/2908999-preferslargetitles
    // Hide title if the title displays in a large format
    const title = this.shadowRoot.querySelector('#title');
    title.style.opacity = 0;

    // Set #background rgb background to body rgb background and remove
    // box-shadow
    const background            = this.shadowRoot.querySelector('#background');
    background.style.background = this.calculateBackgroundColor();
    background.style.boxShadow  = 'none';
  }

  draw() {
    const shadow = this.shadowRoot;
    const title  = this.getAttribute('title');

    shadow.innerHTML = 
`<style>
  #background {
    padding-top: env(safe-area-inset-top);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
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
    transition: opacity 0.2s linear;
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
    <div id="title">${title}</div>
    <div id="controls-right"></div>
  </div>
</div>`;
  }
}

// Define the new element
customElements.define('x-uinavigationbar', UINavigationBar);
