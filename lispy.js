// let readline = require('readline')
let local
function removeSpace (input) {
  var first = input.search(/\S/)
  if (first === -1) {
    return ''
  }
  return input.slice(first)
}
function numberParser (value) {
  let expression = /^[-]?[0-9]+(\.[0-9]+(?:[Ee][+-]?[0-9]+)?)?/
  let result = value.match(expression)
  if (result !== null) return [parseInt(result[0]), value.slice(result[0].length, value.length)]
  else return null
}

function stringParser (input) {
  let regEx = /^[A-Za-z]+/.exec(input)
  let value = input.match(regEx)
  if (value === null) { return null }
  return [value[0], input.slice(value[0].length, input.length)]
}
let env = {
  '+': function add (input) {
    return input.reduce((acc, cur) => {
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
// let current = env

function ifParser (input) {
  input = input.slice(1)
  input = removeSpace(input)
  if (!input.startsWith('if')) {
    return null
  }
  input = input.slice(2)
  input = removeSpace(input)
  let condiCheck = mainFunc(input)
  input = input.slice((input.indexOf(')') + 1), input.length)
  input = removeSpace(input)
  let conseq = mainFunc(input)
  if (condiCheck[0] === true) {
    return conseq[0]
  } else {
    input = input.slice(conseq.length)
    // input = input.slice((input.indexOf(')') + 1), input.length)
    input = removeSpace(input)
    let alt = mainFunc(input)
    return alt[0]
  }
}
function defineParser (input) {
  input = input.slice(1)
  if (!input.startsWith('define')) {
    return null
  }
  input = input.slice(6)
  input = removeSpace(input)
  let key = stringParser(input)
  input = removeSpace(key[1])
  let defvalue = mainFunc(input)
  env[key[0]] = defvalue[0]
  return 'property added in env'
}
function quoteParser (input) {
  input = input.slice(1)
  input = removeSpace(input)
  if (!input.startsWith('quote')) {
    return null
  }
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

function lambdaParser (input) {
  input = input.slice(1)
  input = removeSpace(input)
  if (!input.startsWith('lambda')) {
    return null
  }
  let localEnv = {}
  input = input.slice(6)
  input = removeSpace(input)
  localEnv['envs'] = {}
  localEnv['envs']['parent'] = env
  localEnv['envs']['args'] = {}
  if (input.startsWith('(')) {
    input = input.slice(1)
    while (!input.startsWith(')')) {
      let argu = stringParser(input)
      localEnv['envs']['args'][argu[0]] = null
      input = input.slice(argu[0].length)
    }
    input = input.slice(1)
    input = removeSpace(input)
    localEnv['envs']['expression'] = input
  }
  return [localEnv, input.slice(localEnv['envs']['expression'])]
}

function symbolParser (input) {
  // input = input.slice(1)
  // input = removeSpace(input)
  let result = stringParser(input)
  if (result === null) return null
  if (env.hasOwnProperty(result[0])) {
    if (typeof env[result[0]] === 'object') {
      return updateAndEvalLambda(input)
    }
    return [env[result[0]], result[1]]
  } else {
    if (local['args'].hasOwnProperty(result[0])) {
      return [local['args'][result[0]], result[1]]
    }
  }
  return null
}
function updateAndEvalLambda (input) {
  input = removeSpace(input)
  let keyElm = stringParser(input)
  let current = env
  current = current[keyElm[0]]['envs']
  local = current
  input = input.slice(keyElm[0].length)
  input = removeSpace(input)
  while (!input.startsWith(')')) {
    for (let key in current['args']) {
      let result = mainFunc(input)
      current['args'][key] = result[0]
      // result = result[0].toString()
      input = removeSpace(result[1])
      // input = removeSpace(input)
    }
  }
  return evalLambda(current)
}

function evalLambda (obj) {
  let result = mainFunc(obj['expression'])
  return result
}

function mainFunc (input) {
  let parsers = [numberParser, symbolParser, evalExpressions, ifParser, defineParser, quoteParser, lambdaParser]
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
  if (!env.hasOwnProperty(procedure)) {
    return null
  }
  if (typeof env[procedure] === 'object') {
    return symbolParser(input)
  }
  input = input.slice(input.indexOf(' '))
  input = removeSpace(input)
  while (!input.startsWith(')')) {
    let values = mainFunc(input)
    args.push(values[0])
    input = removeSpace(values[1])
    input = removeSpace(input)
  }
  input = removeSpace(input.slice(1))
  return [env[procedure](args), input]
}

// var rl = readline.createInterface(process.stdin, process.stdout)
// rl.setPrompt('guess> ')
// rl.prompt()
// rl.on('line', function (line) {
//   if (line === 'quit') rl.close()
//   console.log(mainFunc(line))
//   rl.prompt()
// }).on('close', function () {
//   process.exit(0)
// })
// // console.log(rl)

// console.log(mainFunc('(+ 2 (+ 6 (+ 4 8)))'))
// console.log(mainFunc('(define twice (lambda (n) (* 2 n)))'))
// console.log(env)
// console.log(mainFunc('(twice 3)'))
// console.log(localEnv)
// console.log(mainFunc('(if (< 10 20) (+ 1  (+ 3 3))'))
// console.log(env)
// console.log(mainFunc('(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))'))
// console.log(mainFunc('(fact 2)'))
// console.log(mainFunc('(define circlearea (lambda (r) (* pi (* r r))))'))
// console.log(mainFunc('(circlearea 3)'))
// console.log(mainFunc('(if (> 10 20) 1 (+ 3 3))'))
