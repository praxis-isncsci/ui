import {PraxisIsncsciAppBar} from './praxisIsncsciAppBar';
import {PraxisIsncsciAppLayout} from './praxisIsncsciAppLayout';
import {PraxisIsncsciCell} from './praxisIsncsciCell';
import {
  PraxisIsncsciClassification,
  PraxisIsncsciClassificationGrid,
  PraxisIsncsciClassificationTotal,
} from './praxisIsncsciClassification';
import {PraxisIsncsciDialogHeader} from './praxisIsncsciDialogHeader';
import {PraxisIsncsciExtraInputs} from './praxisIsncsciExtraInputs/praxisIsncsciExtraInputs';
import {PraxisIsncsciGrid} from './praxisIsncsciGrid';
import {PraxisIsncsciInput} from './praxisIsncsciInput';
import {PraxisIsncsciInputLayout} from './praxisIsncsciInputLayout';
import {PraxisIsncsciKeyPointsDiagram} from './praxisIsncsciKeyPointsDiagram';

[
  PraxisIsncsciAppBar,
  PraxisIsncsciAppLayout,
  PraxisIsncsciCell,
  PraxisIsncsciClassification,
  PraxisIsncsciClassificationGrid,
  PraxisIsncsciClassificationTotal,
  PraxisIsncsciDialogHeader,
  PraxisIsncsciExtraInputs,
  PraxisIsncsciGrid,
  PraxisIsncsciInput,
  PraxisIsncsciInputLayout,
  PraxisIsncsciKeyPointsDiagram,
].forEach((component) => {
  if (!window.customElements.get(component.is)) {
    window.customElements.define(component.is, component);
  }
});
