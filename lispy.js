function removeSpace (input) {
  var first = input.search(/\S/)
  if (first === -1) {
    return ''
  }
  return input.slice(first)
}

function numberParser (value) {
  let expression = /^[-]?[0-9]+(\.[0-9]+(?:[Ee][+-]?[0-9]+)?)?/
  //  /^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?/
  let result = value.match(expression)
  // console.log(result)
  if (result !== null) return [parseInt(result[0]), value.slice(result[0].length, value.length)]
  else return null
}

function stringParser (str) {
  let regEx = /^[A-Za-z]+/
  let value = str.match(regEx)
  if (value !== null) return [value[0], str.slice(value[0].length, str.length)]
  else return null
}

let Env = {
  '+': function add (input) {
    return input.reduce((acc, cur) => {
      // console.log(cur)
      return parseFloat(acc + cur)
    })
  },
  '-': function minus (input) {
    return input.reduce((acc, cur) => {
      return (acc - parseFloat(cur))
    })
  },
  '*': function multiple (input) {
    return input.reduce((acc, cur) => {
      return parseInt(acc * cur)
    })
  },
  '/': function divide (input) {
    return input.reduce((acc, cur) => {
      return parseFloat(acc / cur)
    })
  },
  '%': function mod (input) {
    return input.reduce((acc, cur) => {
      return parseInt(acc % cur)
    })
  },
  '<': function lessThan (input) {
    return input.reduce((acc, cur) => {
      return parseInt(acc < cur)
    })
  },
  '>': function greaterThan (input) {
    return input.reduce((acc, cur) => {
      return (acc > cur)
    })
  },
  '=': function equal (input) {
    return input.reduce((acc, cur) => {
      return (acc = cur)
    })
  },
  '>=': function greatAndEqual (input) {
    return input.reduce((acc, cur) => {
      return (acc >= cur)
    })
  },
  '<=': function lessAndEEquak (input) {
    return input.reduce((acc, cur) => {
      return (acc <= cur)
    })
  },
  'sqrt': function sqrt (input) {
    return Math.sqrt(input)
  },
  'pi': Math.PI
}

function evalExpressions (input) {
  input = removeSpace(input)
  if (!input.startsWith('(')) return null
  input = input.slice(1)
  input = removeSpace(input)
  let result = identifier(input)
  if (Env.hasOwnProperty(result)) {
    return operator(input)
  } else {
    return specialFunction(input)
  }
}
console.log(evalExpressions('(+ 2 (+ 1 2) (+ 2 5) (+ 1 2) (+ 3 2) (+ 10 (+ 5 5)))'))

function identifier (input) {
  let result = input.slice(0, input.indexOf(' '))
  return result
}

function operator (input) {
  let result = input.slice(0, input.indexOf(' '))
  input = input.slice(input.indexOf(' '), input.length)
  input = removeSpace(input)
  // console.log(input)
  let array = []
  while (!input.startsWith(')')) {
    if (input.startsWith('(')) {
      let values = evalExpressions(input)
      array.push(values)
      input = input.slice((input.indexOf(')') + 1), input.length)
      input = removeSpace(input)
    } else {
      let num = numberParser(input)
      array.push(num[0])
      input = input.slice(1)
      input = removeSpace(num[1])
    }
  }
  return Env[result](array)
}

/// ///////// Special Functions ////////////

function specialFunction (input) {
  if (input.startsWith('if')) return ifParser(input)
  if (input.startsWith('define')) return defineParser(input)
  if (input.startsWith('quote')) return quoteParser(input)
  if (input.startsWith('lambda')) return lambdaParser(input)
}

/// /// if //////////////

function ifParser (input) {
  input = input.slice(2)
  input = removeSpace(input)

  let condiCheck = evalExpressions(input)
  input = input.slice((input.indexOf(')') + 1), input.length)
  input = removeSpace(input)
  let value1 = evalExpressions(input)
  input = input.slice((input.indexOf(')') + 1), input.length)
  input = removeSpace(input)
  let value2 = evalExpressions(input)

  if (condiCheck === true) {
    return value1
  } else {
    return value2
  }
}

function defineParser (input) {
  input = input.slice(6)
  input = removeSpace(input)
  let key = stringParser(input)
  // input = inpu(1)
  input = removeSpace(key[1])
  let defvalue = numberParser(input)
  Env[key[0]] = defvalue[0]
  return 'property added in Env'
}

// function quoteParser (input) {
//   let result = ''
//   input = input.slice(5)
//   input = removeSpace(input)
//   if (input[1].startsWith('(')) {
//     while (!input.startsWith(')')) {
//     // input = input.slice(1)
//       if (input.startsWith('(')) { result += input.slice(0, input.indexOf(')') + 1) }
//       input = input.slice((input.indexOf(')') + 1), input.length)
//       input = removeSpace(input)
//     }
//     return result + ')'
//   }
//   return null
// }

function quoteParser (input) {
  input = input.slice(5)
  let opCount = 0
  let clCount = 0
  input = removeSpace(input)
  if (input.startsWith('(')) {
    for (let i = 0; i < input.length; i++) {
      if (input[i] === '(') {
        opCount++
      } else if (input[i] === ')') {
        clCount++
      }
    }
    if (opCount === (clCount - 1)) { return input.slice(0, input.length - 1) } else { return 'invalid quote' }
  }
  return input
}

function lambdaParser(input){
}