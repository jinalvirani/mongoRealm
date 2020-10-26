import Realm from "realm";

let app;

// Returns the shared instance of the Realm app.
export function getRealmApp() {
  if (app === undefined) {
    const appId = "tasktracker-toewv"; // Set Realm app ID here.
    const appConfig = {
      id: appId,
      timeout: 10000,
    };
    app = new Realm.App(appConfig);
  }
  return app;
}
