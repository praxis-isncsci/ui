import {AppStoreProvider} from '@app/providers';
import {appStore} from '@app/store';

import {App} from './app';

import '@web/praxisIsncsciInputLayout';

const app = new App(appStore, new AppStoreProvider(appStore));
