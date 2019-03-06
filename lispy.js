let array = []
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

let objEval = {
  '+': function add (input) {
    return input.reduce((acc, cur) => {
      return parseInt(acc + cur)
    })
  },
  '-': function minus (input) {
    return input.reduce((acc, cur) => {
      return parseInt(acc - cur)
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
  }
}

function evalExpressions (input) {
  if (!input.startsWith('(')) return null
  input = input.slice(1)
  input = removeSpace(input)
  let result = identifier(input)
  //   console.log(result)
  if (objEval.hasOwnProperty(result)) {
    return operator(input)
  }
}
console.log(evalExpressions('(+ 1 2)'))

function identifier (input) {
  let result = input.slice(0, 1)
  return result
}
function operator (input) {
  let result = input.slice(0, 1)
  input = input.slice(1)
  while (input[0] !== ')') {
    if (input.startsWith('(')) return evalExpressions(input)
    input = removeSpace(input)
    let num = numberParser(input)
    array.push(num[0])
    input = removeSpace(num[1])
  }
  return objEval[result](array)
}
