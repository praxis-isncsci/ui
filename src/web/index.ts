import {PraxisIsncsciCell} from './praxisIsncsciCell';
import {PraxisIsncsciGrid} from './praxisIsncsciGrid';
import {PraxisIsncsciInputLayout} from './praxisIsncsciInputLayout';
import {PraxisIsncsciTotals} from './praxisIsncsciTotals';

[
  PraxisIsncsciCell,
  PraxisIsncsciGrid,
  PraxisIsncsciInputLayout,
  PraxisIsncsciTotals,
].forEach((component) => {
  if (!window.customElements.get(component.is)) {
    window.customElements.define(component.is, component);
  }
});
