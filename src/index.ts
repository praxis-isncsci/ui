import {AppStoreProvider, IsncsciExamProvider} from '@app/providers';
import {appStore} from '@app/store';
import {PraxisIsncsciWebApp} from '@app/webApp';

import '@app/webApp';
import '@web/praxisIsncsciAppBar';
import '@web/praxisIsncsciAppLayout';
import '@web/praxisIsncsciClassification';
import '@web/praxisIsncsciDialogHeader';
import '@web/praxisIsncsciInputLayout';
import '@web/praxisIsncsciKeyPointsDiagram';

const window_onLoad = () => {
  const webApp = document.querySelector(
    'praxis-isncsci-web-app',
  ) as PraxisIsncsciWebApp;
  webApp.initialize(
    appStore,
    new AppStoreProvider(appStore),
    new IsncsciExamProvider(),
  );
};

window.addEventListener('load', window_onLoad);
