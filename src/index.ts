import {AppStoreProvider} from '@app/providers';
import {appStore} from '@app/store';

import {App} from './app';

import '@web/praxisIsncsciAppBar';
import '@web/praxisIsncsciInputLayout';
import '@web/praxisIsncsciTotals';

const app = new App(appStore, new AppStoreProvider(appStore));
