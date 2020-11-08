/* eslint-env jasmine */
"use strict";

const JasmineConsoleReporter = require("jasmine-console-reporter");
const reporter = new JasmineConsoleReporter({
  colors: 1,
  cleanStack: 1,
  verbosity: 4,
  listStyle: "indent",
  activity: false,
});

jasmine.getEnv().addReporter(reporter);
