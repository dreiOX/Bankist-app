'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);

  });
};


//calculate and print balance
const calcAndDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`
};


const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expenses = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(expenses)}€`;

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).filter((int, i, arr) => int >= 1).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};


//create usernames
const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUsernames(accounts);


const updateUI = function(acc) {
  //display movements
  displayMovements(acc.movements);
  
  //display balance
  calcAndDisplayBalance(acc);
  
  //display summary
  calcDisplaySummary(acc);  
};

//EVENT HANDLERS

let currentAccount;

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  

  if (currentAccount?.pin === +inputLoginPin.value) {
    // display UI and message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  
  if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    
    //delete account
    accounts.splice(index, 1);
    
    //hide UI
    containerApp.style.opacity = 0;
  }
  
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
     el => +el.textContent.replace('€', ''));
  
  console.log(movementsUI);

});


/////////////////////////////////////////////////
//PRACTICE
//1.
const bankDepositSum = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositSum);
//2.
const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov > 1000).length;
const numDeposits1000Reduce = accounts.flatMap(acc => acc.movements).reduce((count, cur) => cur > 1000 ? ++count : count, 0 )
console.log(numDeposits1000, numDeposits1000Reduce);

//3.

//or const {deposits, withdrawals}
const sums = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
//sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
  cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;

return sums;
}, {deposits: 0, withdrawals: 0})

//or console.log(deposits, withdrawals)
console.log(sums);

//4 titlecase
const convertTitleCase = function(title) {
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title.toLowerCase().split(' ').map(word => exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join(' ');
  return titleCase;
};


console.log(convertTitleCase('oh i wish oh i wish that i did not have a heart'));
console.log(convertTitleCase('every night is a waterfall but i like it'));
console.log(convertTitleCase('did not have a heart on me with the elf or an apple'));


const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
  ];

  dogs.forEach(dog => dog.recFood = Math.trunc(dog.weight ** 0.75 * 28));
  console.log(dogs);

  const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
  console.log(`Sarah's dog is eating ${dogSarah.curFood > dogSarah.recFood ? 'too much' : 'too little'}`);


  const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recFood).map(dog => dog.owners).flat();
  console.log(ownersEatTooMuch);
  const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recFood).map(dog => dog.owners).flat();
  console.log(ownersEatTooLittle);











/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const owners = ['jonas', 'zach', 'Adam', 'Martha'];
// console.log(owners.sort());

// movements.sort((a, b) => {
//   if (a > b) {
//     return 1;
//   }
//   if (b > a) {
//     return -1;
//   }
// });
// console.log(movements);

// movements.sort((a, b) => {
//   if (a > b) {
//     return -1;
//   }
//   if (a < b) {
//     return 1;
//   }
// });
// console.log(movements);

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, mov) => acc + mov, 0);


// console.log(totalDepositsUSD);
// const deposits = movements.filter(function(mov) {
//   return mov > 0;

// });

// const withdrawals = movements.filter(function(mov) {
//   return mov < 0;
// })
// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// const balance = movements.reduce(function(acc, cur, i, arr) {
//   console.log(`iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);
// console.log(balance);
// // const eurToUsd = 1.1;
// const movementsUSD = movements.map(function(mov, i, arr) {

//   return `movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`;
 
// });
// console.log(movements);
// console.log(movementsUSD);

/////////////////////////////////////////////////


// const julia =  [3, 5, 2, 12, 7];
// const kate =  [4, 1, 15, 8, 3];

// const shallowCopy = [...julia].slice(0, -2);
// console.log(shallowCopy);
//   const juliaOnlyDogs = [...shallowCopy].splice(1);
//   console.log(juliaOnlyDogs);
//   const kateOnlyDogs = [...kate];
  

// const checkDogs = function(dogsJulia, dogsKate) {
  

//   dogsJulia.forEach(function(dogj, i) {
//     if (dogj >= 3) {
//       console.log(`Dog number ${i + 1} is an adult and is ${dogj} years old`);
//     } else {
//       console.log(`Dog no ${i + 1} is still a puppy`);
//     }
//   });

//   dogsKate.forEach(function(dogk, i) {
//     if (dogk >= 3) {
//       console.log(`Dog number ${i + 1} is an adult and is ${dogk} years old`);
//     } else {
//       console.log(`Dog no ${i + 1} is still a puppy`);
//     }
//   });

// }
// checkDogs(juliaOnlyDogs, kateOnlyDogs);

// const calcAverageHumanAge = ages => 
//   ages
//   .map(age => age <= 2 ? 2 * age : 16 + age * 4)
//   .filter((above18) => above18 >= 18)
//   .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0); 

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// function connotation(str) {
//   const firstL = str.toLowerCase().split(' ').map(alph => alph[0]);
//   console.log(firstL);

//   firstL.map(function(letter) {
//     const firstHalf = ['a', 'b', 'c', 'd', 'e','f', 'g', 'h','i','j', 'k', 'l','m'];
//     const secondHalf = ['n', 'o', 'p', 'q', 'r','s', 't', 'u','v','w', 'x', 'y','z'];
    
//     const hg = firstHalf.includes(letter) ? true : false;
//     console.log(hg);
//     const hj = secondHalf.includes(letter) ? false : true;
//     console.log(hj);
//   })
// }
// connotation('A big brown fox caught a bad bunny');
// connotation('Xylophones can obtain Xenon.')

// const account = accounts.find(acc  => acc.owner === 'Jessica Davis');
// console.log(account);

// const diceRolls = Array.from({length: 100}, () => Math.trunc(Math.random() * 6 + 1));
// console.log(diceRolls);







