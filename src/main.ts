import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// import './y43/y43config.ts';
// import './y43/y43utils.ts';
// import './y43/y43rpc.ts';
// import './y43/y43arg.ts';
// import './y43/y43function.ts';
// import './y43/examples/test1.ts';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
