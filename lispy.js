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
  }
}

function evalExpressions (input) {
  if (!input.startsWith('(')) return null
  input = input.slice(1)
  input = removeSpace(input)
  let result = identifier(input)
  if (Env.hasOwnProperty(result)) { return operator(input) }
}
console.log(evalExpressions('( + 1 (+ 1 2) ( + 1 1))'))

function identifier (input) {
  let result = input.slice(0, 1)
  return result
}

function operator (input) {
  let result = input.slice(0, 1)
  input = input.slice(1)
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
