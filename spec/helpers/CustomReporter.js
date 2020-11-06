/* eslint-env jasmine */
"use strict";

process.env.NODE_ENV = "test";

const JasmineConsoleReporter = require("jasmine-console-reporter");
const reporter = new JasmineConsoleReporter({
  colors: 1,
  cleanStack: 1,
  verbosity: 4,
  listStyle: "indent",
  activity: false,
});

jasmine.getEnv().addReporter(reporter);
