export const getAppLayoutTemplate = (
  classificationStyle: '' | 'visible' | 'static',
  iconsPath: string,
): string => {
  return `
    <praxis-isncsci-app-layout classification-style="${classificationStyle}">
      <praxis-isncsci-app-bar slot="app-bar">
        <button class="button icon-button" slot="menu-button">
          <praxis-isncsci-icon
            href="${iconsPath}/regular.svg#icon-hamburger-menu-24"
            size="24"
          ></praxis-isncsci-icon>
        </button>
        <span slot="title">&nbsp;</span>
        <div slot="actions">
          <button class="button" action-calculate>
            <praxis-isncsci-icon
              href="${iconsPath}/regular.svg#icon-calculator-20"
              size="20"
            ></praxis-isncsci-icon>
            Calculate
          </button>
        </div>
      </praxis-isncsci-app-bar>
      <praxis-isncsci-input-layout
        slot="input-layout"
      ></praxis-isncsci-input-layout>
      <praxis-isncsci-classification slot="classification">
        <praxis-isncsci-dialog-header slot="header">
          <h2 slot="title">Classification</h2>
          <div slot="close">
            <button class="button icon-button" action-close-classification>
              <praxis-isncsci-icon
                href="${iconsPath}/regular.svg#icon-close-24"
                size="24"
              ></praxis-isncsci-icon>
            </button>
          </div>
        </praxis-isncsci-dialog-header>
        <!-- Neurological levels -->
        <praxis-isncsci-classification-grid
          slot="neurological-levels"
          class="classification-grid"
        >
          <h3 slot="heading">Neurological levels</h3>
          <div slot="grid">
            <div>&nbsp;</div>
            <div class="text-caption-2 col-header">R</div>
            <div class="text-caption-2 col-header">L</div>
            <div class="text-caption-2 row-header">Sensory</div>
            <praxis-isncsci-classification-total data-total="right-sensory"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="left-sensory"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <div class="text-caption-2 row-header">Motor</div>
            <praxis-isncsci-classification-total data-total="right-motor"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="left-motor"
              >&nbsp;</praxis-isncsci-classification-total
            >
          </div>
        </praxis-isncsci-classification-grid>
        <!-- NLI -->
        <praxis-isncsci-classification-grid slot="nli">
          <h3 slot="heading">Neurological Level of Injury<br />(NLI)</h3>
          <div slot="grid">
            <praxis-isncsci-classification-total data-total="neurological-level-of-injury"
              >&nbsp;</praxis-isncsci-classification-total
            >
          </div>
        </praxis-isncsci-classification-grid>
        <!-- AIS -->
        <praxis-isncsci-classification-grid slot="ais">
          <h3 slot="heading">Asia Impairment Scale<br />(AIS)</h3>
          <div slot="grid">
            <praxis-isncsci-classification-total data-total="asia-impairment-scale"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="injury-complete"
              >&nbsp;</praxis-isncsci-classification-total
            >
          </div>
        </praxis-isncsci-classification-grid>
        <!-- ZPP -->
        <praxis-isncsci-classification-grid slot="zpp">
          <h3 slot="heading">Zone of partial preservation</h3>
          <div slot="grid">
            <div>&nbsp;</div>
            <div class="text-caption-2 col-header">R</div>
            <div class="text-caption-2 col-header">L</div>
            <div class="text-caption-2 row-header">Sensory</div>
            <praxis-isncsci-classification-total data-total="right-sensory-zpp"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="left-sensory-zpp"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <div class="text-caption-2 row-header">Motor</div>
            <praxis-isncsci-classification-total data-total="right-motor-zpp"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="left-motor-zpp"
              >&nbsp;</praxis-isncsci-classification-total
            >
          </div>
        </praxis-isncsci-classification-grid>
        <!-- Sub-scores -->
        <praxis-isncsci-classification-grid slot="sub-scores">
          <h3 slot="heading">Sub-scores</h3>
          <div slot="grid">
            <div>&nbsp;</div>
            <div class="text-caption-2 col-header">R</div>
            <div class="text-caption-2 col-header">L</div>
            <div class="text-caption-2 col-header">Total</div>
            <div class="text-caption-2 row-header">UEMS</div>
            <praxis-isncsci-classification-total data-total="right-upper-motor-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="left-upper-motor-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="upper-motor-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <div class="text-caption-2 row-header">LEMS</div>
            <praxis-isncsci-classification-total data-total="right-lower-motor-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="left-lower-motor-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="lower-motor-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <div class="text-caption-2 row-header">Light touch</div>
            <praxis-isncsci-classification-total data-total="right-light-touch-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="left-light-touch-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="touch-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <div class="text-caption-2 row-header">Pin prick</div>
            <praxis-isncsci-classification-total data-total="right-pin-prick-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="left-pin-prick-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
            <praxis-isncsci-classification-total data-total="pin-prick-total"
              >&nbsp;</praxis-isncsci-classification-total
            >
          </div>
        </praxis-isncsci-classification-grid>
      </praxis-isncsci-classification>
    </praxis-isncsci-app-layout>
  `;
};
