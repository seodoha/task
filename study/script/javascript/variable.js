'use strict';

// Variable
// let (added in ES6)
let globalName = 'global name';
{
    let name = 'ellie';
    // console.log(name);
    name = 'hello';
    // console.log(name);
}
// console.log(name);
// console.log(globalName);

// var (don't ever use this!)
// var hoisting (move declaration from bottom to top)
// has no block scope
{
    age = 4;
    var age;
}
// console.log(age);


// Array

// 1. Declaration
const arr1 = new Array();
const arr2 = [1, 2];

// 2. Index position
const fruits = ['🍓', '🍅'];
console.log(fruits);
console.log(fruits.length);
console.log(fruits[0]);
console.log(fruits[1]);
console.log(fruits[fruits.length-1]);

console.clear();
// 3. Looping over an array
// print all fruits
// a. for
for (let i=0;i<fruits.length;i++) {
    console.log(fruits[i]);
}

// b. for of
for (let fruit of fruits) {
    console.log(fruit);
}

// c. forEach
fruits.forEach((fruit) => console.log(fruit));

// 4. Addtion, deletion, copy
// push: add an item to the end
fruits.push('🍒','🍌');
console.log(fruits);

// pop: remove an item to the end
fruits.pop();
fruits.pop();
console.log(fruits);

// unshift: add an item to the beginning
fruits.unshift('🍉', '🍈');
console.log(fruits);

// shift: remove an item to the beginning
fruits.shift();
fruits.shift();
console.log(fruits);

// note!! shift, unshift are slower than pop, push
// spice: remove an item by index position
fruits.push('🍆','🌶');
console.log(fruits);
fruits.splice(1, 1, '🍘', '🍙');
console.log(fruits);

//combine two arrays
const fruits2 = ['🍕', '🍔'];
const newFruits = fruits.concat(fruits2);
console.log(newFruits);

// 5. Searching
// indexOf: find the index
// includes
// lastIndexOf
console.clear();
console.log(fruits);