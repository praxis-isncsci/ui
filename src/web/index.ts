import {PraxisIsncsciAppBar} from './praxisIsncsciAppBar';
import {PraxisIsncsciAppLayout} from './praxisIsncsciAppLayout';
import {PraxisIsncsciCell} from './praxisIsncsciCell';
import {
  PraxisIsncsciClassification,
  PraxisIsncsciClassificationGrid,
  PraxisIsncsciClassificationTotal,
} from './praxisIsncsciClassification';
import {PraxisIsncsciDialogHeader} from './praxisIsncsciDialogHeader';
import {PraxisIsncsciGrid} from './praxisIsncsciGrid';
import {PraxisIsncsciInput} from './praxisIsncsciInput';
import {PraxisIsncsciInputLayout} from './praxisIsncsciInputLayout';

[
  PraxisIsncsciAppBar,
  PraxisIsncsciAppLayout,
  PraxisIsncsciCell,
  PraxisIsncsciClassification,
  PraxisIsncsciClassificationGrid,
  PraxisIsncsciClassificationTotal,
  PraxisIsncsciDialogHeader,
  PraxisIsncsciGrid,
  PraxisIsncsciInput,
  PraxisIsncsciInputLayout,
].forEach((component) => {
  if (!window.customElements.get(component.is)) {
    window.customElements.define(component.is, component);
  }
});
