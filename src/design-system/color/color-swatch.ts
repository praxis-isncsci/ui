export class ColorSwatch extends HTMLElement {
  public static get is(): string {
    return 'color-swatch';
  }

  private template: string = `
    <style>
      :host {
        border: solid 1px #E2E2E2;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 6px;
      }

      .swatch {
        background-color: var(--swatch);
        border: solid 1px #CCC;
        border-radius: 3px;
        height: 100px;
      }

      .variant,
      .value {
        display: block;
        padding: 0 4px;
      }

      .variant {
        font-weight: bold;
      }

      .value {
        text-transform: uppercase;
      }

      .token {
        font-size: 14px;
      }
    </style>
    <div class="swatch"></div>
    <slot name="variant" class="variant"></slot>
    <slot name="value" class="value"></slot>
    <slot name="token" class="token"></slot>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(ColorSwatch.is, ColorSwatch);
