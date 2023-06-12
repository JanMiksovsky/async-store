import assert from "node:assert";
import { describe, test } from "node:test";
import ObjectGraph from "../src/ObjectGraph.js";
import utilities from "../src/utilities.js";

describe("utilities", () => {
  test("entries returns the [key, value] pairs", async () => {
    const fixture = objectStore();
    assert.deepEqual(
      [...(await utilities.entries(fixture))],
      [
        ["Alice.md", "Hello, **Alice**."],
        ["Bob.md", "Hello, **Bob**."],
        ["Carol.md", "Hello, **Carol**."],
      ]
    );
  });

  test("forEach invokes a callback for each entry", async () => {
    const fixture = objectStore();
    const results = {};
    await utilities.forEach(fixture, async (value, key) => {
      results[key] = value;
    });
    assert.deepEqual(results, {
      "Alice.md": "Hello, **Alice**.",
      "Bob.md": "Hello, **Bob**.",
      "Carol.md": "Hello, **Carol**.",
    });
  });

  test("getRealmObjectPrototype returns the object's root prototype", () => {
    const obj = new ObjectGraph({});
    const proto = utilities.getRealmObjectPrototype(obj);
    assert.equal(proto, Object.prototype);
  });

  test("has returns true if the key exists", async () => {
    const fixture = objectStore();
    assert.equal(await utilities.has(fixture, "Alice.md"), true);
    assert.equal(await utilities.has(fixture, "David.md"), false);
  });

  test("isAsyncDictionary returns true if the object is a dictionary", () => {
    assert.equal(utilities.isAsyncDictionary({}), false);
    assert.equal(utilities.isAsyncDictionary(objectStore()), true);
  });

  test("isAsyncMutableDictionary returns true if the object is a mutable dictionary", () => {
    assert.equal(
      utilities.isAsyncMutableDictionary({
        get() {},
        keys() {},
      }),
      false
    );
    assert.equal(utilities.isAsyncMutableDictionary(objectStore()), true);
  });

  test("isPlainObject returns true if the object is a plain object", () => {
    assert.equal(utilities.isPlainObject({}), true);
    assert.equal(utilities.isPlainObject(new Object()), true);
    assert.equal(utilities.isPlainObject(Object.create(null)), true);
    assert.equal(utilities.isPlainObject(new ObjectGraph({})), false);
  });

  test("values returns the store's values", async () => {
    const fixture = objectStore();
    assert.deepEqual(
      [...(await utilities.values(fixture))],
      ["Hello, **Alice**.", "Hello, **Bob**.", "Hello, **Carol**."]
    );
  });

  test("clear removes all values", async () => {
    const fixture = objectStore();
    await utilities.clear(fixture);
    assert.deepEqual([...(await utilities.entries(fixture))], []);
  });

  test("delete removes a value", async () => {
    const fixture = objectStore();
    await utilities.delete(fixture, "Alice.md");
    assert.deepEqual(
      [...(await utilities.entries(fixture))],
      [
        ["Bob.md", "Hello, **Bob**."],
        ["Carol.md", "Hello, **Carol**."],
      ]
    );
  });
});

function objectStore() {
  return new ObjectGraph({
    "Alice.md": "Hello, **Alice**.",
    "Bob.md": "Hello, **Bob**.",
    "Carol.md": "Hello, **Carol**.",
  });
}
