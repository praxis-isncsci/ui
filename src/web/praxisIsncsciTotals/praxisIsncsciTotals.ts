/**
 * @tagname praxis-isncsci-totals
 */
export class PraxisIsncsciTotals extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-totals';
  }

  public static get observedAttributes(): string[] {
    return [
      'asia-level',
      'complete-injury',
      'left-light-touch-total',
      'left-lower-motor-total',
      'left-motor',
      'left-motor-total',
      'left-motor-zpp',
      'left-pin-prick-total',
      'left-sensory',
      'left-sensory-zpp',
      'left-touch-total',
      'left-upper-motor-total',
      'lower-motor-total',
      'neurological-level',
      'pin-prick-total',
      'right-light-touch-total',
      'right-lower-motor-total',
      'right-motor',
      'right-motor-total',
      'right-motor-zpp',
      'right-pin-prick-total',
      'right-sensory',
      'right-sensory-zpp',
      'right-touch-total',
      'right-upper-motor-total',
      'touch-total',
      'upper-motor-total',
    ];
  }

  private template() {
    return `
      <style>
        :host {
          display: block;
        }

        .total {
          border: solid 1px #000;
          display: inline-block;
          min-height: 32px;
          min-width: 40px;
        }

        .label-total {
          display: flex;
          gap: 8px;
        }

        .label-total div:first-child {
          min-width: 236px;
        }
      </style>
      <div right-totals>
        <div>Right totals</div>
        <div class="label-total">
          <div>Right motor total:</div>
          <div class="total" data-observation="right-motor-total"></div>
        </div>
        <div class="label-total">
          <div>Right light touch total:</div>
          <div class="total" data-observation="right-light-touch-total"></div>
        </div>
        <div class="label-total">
          <div>Right pin prick total:</div>
          <div class="total" data-observation="right-pin-prick-total"></div>
        </div>
      </div>
      <div left-totals>
        <div>Left totals</div>
        <div class="label-total">
          <div>Left motor total:</div>
          <div class="total" data-observation="left-motor-total"></div>
        </div>
        <div class="label-total">
          <div>Left light touch total:</div>
          <div class="total" data-observation="left-light-touch-total"></div>
        </div>
        <div class="label-total">
          <div>Left pin prick total:</div>
          <div class="total" data-observation="left-pin-prick-total"></div>
        </div>
      </div>
      <div motor-subscores>
        <div>Motor subscores</div>
        <div class="label-total">
          <div>UER MAX (25)</div>
          <div class="total" data-observation="right-upper-motor-total"></div>
        </div>
        <div class="label-total">
          <div>UEL (25)</div>
          <div class="total" data-observation="left-upper-motor-total"></div>
        </div>
        <div class="label-total">
          <div>UEMS Total (50)</div>
          <div class="total" data-observation="upper-motor-total"></div>
        </div>
        <div class="label-total">
          <div>LER MAX (25)</div>
          <div class="total" data-observation="right-lower-motor-total"></div>
        </div>
        <div class="label-total">
          <div>+ LEL (25)</div>
          <div class="total" data-observation="left-lower-motor-total"></div>
        </div>
        <div class="label-total">
          <div>LEMS Total</div>
          <div class="total" data-observation="lower-motor-total"></div>
        </div>
      </div>
      <div sensory-subscores>
        <div>Sensory subscores</div>
        <div class="label-total">
          <div>LTR MAX (56)</div>
          <div class="total" data-observation="right-touch-total"></div>
        </div>
        <div class="label-total">
          <div>LTL (56)</div>
          <div class="total" data-observation="left-touch-total"></div>
        </div>
        <div class="label-total">
          <div>LT Total (112)</div>
          <div class="total" data-observation="touch-total"></div>
        </div>
        <div class="label-total">
          <div>PPR MAX (56)</div>
          <div class="total" data-observation="right-pin-prick-total"></div>
        </div>
        <div class="label-total">
          <div>PPL (56)</div>
          <div class="total" data-observation="left-pin-prick-total"></div>
        </div>
        <div class="label-total">
          <div>PP Total</div>
          <div class="total" data-observation="pin-prick-total"></div>
        </div>
      </div>
      <div totals>
        <div>
          <div>Neurological levels</div>
          <div>Steps 1-6 for classification</div>
          <div class="label-total">
            <div>Right sensory</div>
            <div class="total" data-observation="right-sensory"></div>
          </div>
          <div class="label-total">
            <div>Left sensory</div>
            <div class="total" data-observation="left-sensory"></div>
          </div>
          <div class="label-total">
            <div>Right motor</div>
            <div class="total" data-observation="right-motor"></div>
          </div>
          <div class="label-total">
            <div>Left motor</div>
            <div class="total" data-observation="left-motor"></div>
          </div>
        </div>
        <div>
          <div class="label-total">
            <div>Neurological level of injury (NLI)</div>
            <div class="total" data-observation="neurological-level"></div>
          </div>
        </div>
        <div>
          <div>Complete or incomplete?</div>
          <div class="label-total">
            <div>Incomplete = Any sensory or motor funtion in S4-5</div>
            <div class="total" data-observation="complete-injury"></div>
          </div>
        </div>
        <div>
          <div class="label-total">
            <div>ASIA impairment scale (AIS)</div>
            <div class="total" data-observation="asia-level"></div>
          </div>
        </div>
        <div>
          <div>Zone of partial preservation</div>
          <div>(In injuries with absent motor OR sensory function in S4-5 only)</div>
          <div class="label-total">
            <div>Right sensory ZPP</div>
            <div class="total" data-observation="right-sensory-zpp"></div>
          </div>
          <div class="label-total">
            <div>Left sensory ZPP</div>
            <div class="total" data-observation="left-sensory-zpp"></div>
          </div>
          <div class="label-total">
            <div>Right motor ZPP</div>
            <div class="total" data-observation="right-motor-zpp"></div>
          </div>
          <div class="label-total">
            <div>Left motor ZPP</div>
            <div class="total" data-observation="left-motor-zpp"></div>
          </div>
        </div>
      </div>
    `;
  }

  public constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.updateView();
  }

  private updateView() {
    if (!this.shadowRoot) {
      throw new Error(
        `${PraxisIsncsciTotals.is} :: updateView :: No shadowroot available`,
      );
    }

    this.shadowRoot.innerHTML = `${this.template()}`;
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ) {
    if (oldValue === newValue) {
      return;
    }

    const elements = this.shadowRoot?.querySelectorAll(
      `[data-observation="${name}"]`,
    );

    elements?.forEach((element) => (element.innerHTML = newValue));
  }
}

window.customElements.define(PraxisIsncsciTotals.is, PraxisIsncsciTotals);
