# AoC-2021
My TypeScript solutions for the 2021 edition of Advent of Code

The scripts on this repo take care of everything for me: preparing the boilerplate code for the day,
downloading the input, submitting the answers, updating the output file with the correct answers,
running tests against the output files to make sure that the solution is still correct after a refactor...

Available scripts:

## `prepare-day`
It creates the folder for a day and it adds the `solution.ts` file inside that days folder.
Warning: if the file already exists it will be replaced.

**Examples**

If you run the following script on the December 10th:
```bash
npm run prepare-day
```
then it will create the solution boilerplate file under: `src/10/solution.ts`.

If you wish to create the boilerplate file for another day, then just pass the day as an argument.
For example if you want to create the boilerplate for day 5, then run

```bash
npm run prepare-day 5
```
which will create the solution boilerplate file under: `src/5/solution.ts`.

## `download`
**Make sure that the root `.session` file contains the token of your session.**

It downloads your`input` file for that days folder.

**Examples**

If you run the following script on the December 10th:
```bash
npm run download
```
then it will download the input for the current day under: `src/10/input`.

If you wish to download the input of another day, then just pass the day and the year as optional arguments.
If you don't pass the year it will default to the current year, if you don't pass the day it will default to the current day.
For example if you want to download the input for day 5 of the current year, then run:

```bash
npm run download 5
```
which will download the input for the input for day 5 under: `src/10/input`.

However, perhaps you are solving the problems of another year, then you could:


```bash
npm run download 5 2019
```

## `solution`
**Make sure that the root `.session` file contains the token of your session.**

It submits the solution for you, and if you recently failed a submission, then it waits the
necessary amount of time and then it submits the new solution. Also, if the answer is correct,
it updates the `outputs` files for that day. So, that if later on you want to refactor your
code, you can run the `test` script to check if the refactored code still works.

## `test`
It tests the solutions against the outputs.
