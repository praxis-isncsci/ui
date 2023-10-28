import {PraxisIsncsciAppBar} from './praxisIsncsciAppBar';
import {PraxisIsncsciCell} from './praxisIsncsciCell';
import {
  PraxisIsncsciClassification,
  PraxisIsncsciClassificationGrid,
  PraxisIsncsciClassificationTotal,
} from './praxisIsncsciClassification';
import {PraxisIsncsciDialogHeader} from './praxisIsncsciDialogHeader';
import {PraxisIsncsciGrid} from './praxisIsncsciGrid';
import {PraxisIsncsciInputLayout} from './praxisIsncsciInputLayout';

[
  PraxisIsncsciAppBar,
  PraxisIsncsciCell,
  PraxisIsncsciClassification,
  PraxisIsncsciClassificationGrid,
  PraxisIsncsciClassificationTotal,
  PraxisIsncsciDialogHeader,
  PraxisIsncsciGrid,
  PraxisIsncsciInputLayout,
].forEach((component) => {
  if (!window.customElements.get(component.is)) {
    window.customElements.define(component.is, component);
  }
});
