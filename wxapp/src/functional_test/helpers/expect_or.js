function expect_or(...tests) {
  try {
    tests.shift()();
  } catch(e) {
    if (tests.length) expect_or(...tests);
    else throw e;
  }
}

module.exports = expect_or;
