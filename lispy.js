let readline = require('readline')
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

function stringParser (input) {
  let regEx = /^[A-Za-z]+/.exec(input)
  let value = input.match(regEx)
  if (value === null) { return null }
  if (env.hasOwnProperty(value[0])) {
    return [env[value[0]], input.slice(value[0].length, input.length)]
  }
  return [value[0], input.slice(value[0].length, input.length)]
}
let env = {
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
      return parseFloat(acc * cur)
    })
  },
  '/': function divide (input) {
    return input.reduce((acc, cur) => {
      return parseFloat(acc / cur)
    })
  },
  '%': function mod (input) {
    return input.reduce((acc, cur) => {
      return parseFloat(acc % cur)
    })
  },
  '<': function lessThan (input) {
    return input.reduce((acc, cur) => {
      return (acc < cur)
    })
  },
  '>': function greaterThan (input) {
    return input.reduce((acc, cur) => {
      return (acc > cur)
    })
  },
  '===': function equal (input) {
    return input.reduce((acc, cur) => {
      return (acc === cur)
    })
  },
  '>=': function greatAndEqual (input) {
    return input.reduce((acc, cur) => {
      return (acc >= cur)
    })
  },
  '<=': function lessAndEqual (input) {
    return input.reduce((acc, cur) => {
      return (acc <= cur)
    })
  },
  'sqrt': function sqrt (input) {
    return Math.sqrt(input)
  },
  'pi': Math.PI
}

function ifParser (input) {
  if (!input.includes('if')) {
    return null
  }
  input = input.slice(3)
  input = removeSpace(input)
  let condiCheck = mainFunc(input)
  input = input.slice((input.indexOf(')') + 1), input.length)
  input = removeSpace(input)
  let conseq = mainFunc(input)
  input = input.slice((input.indexOf(')') + 1), input.length)
  input = removeSpace(input)
  let alt = mainFunc(input)
  if (condiCheck[0] === true) {
    return conseq[0]
  } else {
    return alt[0]
  }
}
function defineParser (input) {
  if (!input.includes('define')) {
    return null
  }
  input = input.slice(7)
  input = removeSpace(input)
  let key = stringParser(input)
  // input = inpu(1)
  input = removeSpace(key[1])
  if (input.startsWith('(')) input = evalExpressions(input)
  let defvalue = numberParser(input)
  env[key[0]] = defvalue[0]
  //   console.log(env)
  return 'property added in env'
}

function quoteParser (input) {
  if (!input.includes('quote')) {
    return null
  }
  input = input.slice(6)
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

function mainFunc (input) {
  let parsers = [numberParser, stringParser, evalExpressions, ifParser, defineParser, quoteParser]
  for (let parser of parsers) {
    let result = parser(input)
    if (result !== null) return result
  }
  return null
}

function evalExpressions (input) {
  input = removeSpace(input)
  let args = []
  if (!input.startsWith('(')) {
    return null
  }
  input = input.slice(1)
  input = removeSpace(input)
  let procedure = input.slice(0, input.indexOf(' '))
  input = input.slice(input.indexOf(' '))
  input = removeSpace(input)
  if (!env.hasOwnProperty(procedure)) {
    return null
  }
  while (!input.startsWith(')')) {
    let values = mainFunc(input)
    args.push(values[0])
    input = removeSpace(values[1])
    // input = input.slice(String(values[0]).length, input.length)
    input = removeSpace(input)
  }
  input = removeSpace(input.slice(1))

  return [env[procedure](args), input]
  // return env[procedure](args)
}

var rl = readline.createInterface(process.stdin, process.stdout)
rl.setPrompt('guess> ')
rl.prompt()
rl.on('line', function (line) {
  if (line === 'quit') rl.close()
  console.log(mainFunc(line))
  rl.prompt()
}).on('close', function () {
  process.exit(0)
})
// console.log(rl)
// console.log(mainFunc('(+ 2 (+ 6 (+ 4 8)))'))
// console.log(mainFunc('hr'))
