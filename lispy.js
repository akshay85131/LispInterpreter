
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

function mainFunc (input) {
  let parsers = [numberParser, evalExpressions]
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
  }
  input = removeSpace(input.slice(1))
  return env[procedure](args)
}
console.log(mainFunc('(+ 1 (+ 5 2))'))
