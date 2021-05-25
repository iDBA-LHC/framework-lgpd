// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  envName: "dev",
  apiURL: "http://10.0.1.50:3010/api-idba/integrate",
  apiURLAD: "http://10.0.1.50:3010/api-idba/authenticate-ad",
  envDesc: "Homologação",
  timeout: 60000,
  encryptionKey: "_iDB@Fram3w0rk_M@r1oneT3"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// img {
//   filter: gray; /* IE6-9 */
//   -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
//   filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
// }

// /* Disable grayscale on hover */
// img:hover {
//   -webkit-filter: grayscale(0);
//   filter: none;
// }
