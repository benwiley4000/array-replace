# array-replace

> A minimal ponyfill/polyfill implementing proposed `Array.prototype.replace` for ECMAScript (JavaScript)

### `arrayReplace(array, index, value)`

```js
const array1 = [1,2,3];
const array2 = arrayReplace(array1, 1, 4); // [1,4,3]
```

*or ...*

### `arrayReplace(array, replacements)`

```js
const array3 = [1,2,3,4,5];
const array4 = arrayReplace(array3, { 1: 7, 3: 48 }); // [1,7,3,48,5]
```

*... or you can even polyfill it!*

### `Array.prototype.replace(index, value)` / `Array.prototype.replace(replacements)`

```js
arrayReplace.polyfill();
const array2 = array1.replace(1, 4); // [1,4,3]
const array4 = array3.replace({ 1: 7, 3: 48 }); // [1,7,3,48,5]
```

## including

In Node/Webpack/Browserify/Rollup/etc:

```console
npm install @benwiley4000/array-replace
```

```js
const arrayReplace = require('array-replace');

// if you want to polyfill...
arrayReplace.polyfill();
// ...etc
```

In a browser script tag:

```html
<script src="https://unpkg.com/@benwiley4000/array-replace"></script>
<script>
  // if you want to polyfill...
  arrayReplace.polyfill();
  // ... etc
</script>
```

## why?

With all the nice additions to the ECMAScript standard library and syntax lately enabling expressive programming without mutation, one common operation stands out as cumbersome: cloning and replacing an item from an array.

```js
// step 1
const array1 = [1,2,3];

// step 2
const array2 = [...array1];

// step 3
array1[1] = 4; // [1,4,3]
```

These days with [Object rest spread syntax](https://github.com/tc39/proposal-object-rest-spread), such an operation with normal objects is easy to do in one line.

```js
// step 1
const object1 = { foo: 'hey', bar: 'ho' };
// step 2
const object2 = { ...object1, foo: 'hello' }; // { foo: 'hello', bar: 'ho' }
```

### some good reasons

Ok, so you had to waste one more line... so what? Here are some good reasons:

1. Sometimes we want to express update logic inline inside of an object literal.

    Here's an example of how array replacement can complicate what would otherwise be a single-statement function:
    ```js
    function stateUpdater(oldState, newStuff) {
      const newNumbers = [...oldState.numbers];
      newNumbers[newStuff.numberReplacement.index] =
        newNumbers[newStuff.numberReplacement.value];
      return {
        ...oldState,
        newCount: oldState.count + newStuff.count,
        newNumbers
      };
    }
    ```
    We can use an immediately-invoked function expression (IIFE) to put that logic inline:
    ```js
    function stateUpdater(oldState, newStuff) {
      return {
        ...oldState,
        newCount: oldState.count + newStuff.count,
        newNumbers: (() => {
          const newNumbers = [...oldState.numbers];
          newNumbers[newStuff.numberReplacement.index] =
            newNumbers[newStuff.numberReplacement.value];
          return newNumbers;
        })()
      };
    }
    ```
    However this is still verbose and there is a cost to allocating and executing a function inline.
    Now check out the same thing with `Array.prototype.replace`:
    ```js
    function stateUpdater(oldState, newStuff) {
      return {
        ...oldState,
        newCount: oldState.count + newStuff.count,
        newNumbers: oldState.numbers.replace(
          newStuff.numberReplacement.index,
          newStuff.numberReplacement.value
        )
      };
    }
    ```

2. Because it is generally less verbose, it can be tempting to use `Array.prototype.splice`, which mutates the original array. Inclusion of `Array.prototype.replace` discourages the practice of mutation for the sake of convenience.

    E.g. this, using `splice`, which mutates the input parameter:
    ```js
    function replaceFifthElement(array, elem) {
      array.splice(4, 1, elem);
      return array;
    }
    ```
    is simpler to write than this, which does not mutate the input parameter:
    ```js
    function replaceFifthElement(array, elem) {
      const newArray = [...array];
      newArray[4] = elem;
      return newArray;
    }
    ```
    ... but this, which also does not mutate the input parameter, is simpler than the first example.
    ```js
    function replaceFifthElement(array, elem) {
      return array.replace(4, elem);
    }
    ```

3. Each of the last two example functions can be written as arrow functions without a multi-statement body.

    ```js
    const stateUpdater = (oldState, newStuff) => ({
      ...oldState,
      newCount: oldState.count + newStuff.count,
      newNumbers: oldState.numbers.replace(
        newStuff.numberReplacement.index,
        newStuff.numberReplacement.value
      )
    });

    const replaceFifthElement = (array, elem) => array.replace(4, elem);
    ```

### alternative considerations

* If runtime parameter typechecking is determined to be too expensive, we could have two methods: `Array.prototype.replace` and `Array.prototype.replaceAll` (for the object variant)
* The object variant is included because it is slightly more performant than chaining `.replace(index, value)` many times in a row, but it's not necessarily clear that performance advantage would exist for a native implementation.
* Consideration was given to a syntax extension instead of a standard library addition, similar to what is allowed by [object rest spreading](https://github.com/tc39/proposal-object-rest-spread):
    ```js
    const array = [
      ...[1,2,3],
      1: 4
    ];
    ```
    However, this syntax would probably be confusing since it would allow an array literal to declare members in duplicate fashion or out-of-order, which is currently possible for plain objects but not arrays.

### contributing

Please feel free to open an issue to discuss anything!
