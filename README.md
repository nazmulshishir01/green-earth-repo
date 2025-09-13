# Answer The Following Question of Assignment 6

## 1)  What is the difference between var, let, and const?

-   **var**: Old way to declare variables. Not block-scoped and can be
    redeclared.
-   **let**: Modern way. Block-scoped, value can change but not
    redeclared.
-   **const**: Like let, but cannot be reassigned. For objects/arrays,
    you can change contents but not the variable itself.

------------------------------------------------------------------------

## 2) What is the difference between map(), forEach(), and filter()?

-   **map()**: Creates a new array by transforming each item.\
    *Example*: double all numbers in a list.

-   **forEach()**: Loops through each item but does not return anything.
    You usually use it for side effects, like logging.

-   **filter()**: Creates a new array containing only the items that
    match a condition.\
    *Example*: keep only even numbers.

------------------------------------------------------------------------

## 3) What are arrow functions in ES6?

Arrow functions are a shorter way to write functions.

``` javascript
const add = (a, b) => a + b;
```

They don't have their own `this`, which means they use `this` from the
place they are written. They're great for callbacks and keeping code
clean.

------------------------------------------------------------------------

## 4)  How does destructuring assignment work in ES6?

Destructuring lets you pull values from arrays or objects directly into
variables.

``` javascript
const [a, b] = [1, 2];
const {name, age} = {name: "Alice", age: 25};
```

It makes code shorter and easier to read, especially when working with
objects and arrays.

------------------------------------------------------------------------

## 5) Explain template literals in ES6. How are they different from string concatenation?

Template literals are strings written with backticks (`` ` ``).\
They let you:

-   Insert variables easily:

``` javascript
const name = "Alice";
`Hello, ${name}`;
```

-   Write multi-line strings without `\n`.

**Difference from concatenation**: With template literals, you don't
need to use `+` to join strings, and you can directly put variables or
expressions inside `${ }`. This makes code much cleaner.
