function tokenize(program) {
  program = program.replaceAll('(', ' ( ');
  program = program.replaceAll(')', ' ) ');
  return program.split(' ').filter(ch => ch !== '');
}

function parse_atom(token) {
  const parsed = Number(token);
  if (isNaN(parsed)) {
    return token;
  } else {
    return parsed;
  }
}

function parse_tokens(tokens) {
  if (tokens.length === 0) {
    throw 'unexpected EOF';
  }
  const next_token = tokens.shift();
  if (next_token === '(') {
    const list = [];
    while (tokens[0] != ')') {
      list.push(parse_tokens(tokens));
    }
    tokens.shift();
    return list;
  } else if (next_token === ')') {
    throw 'unexpected )';
  } else {
    return parse_atom(next_token);
  }
}

function parse(program) {
  const tokens = tokenize(program);
  return parse_tokens(tokens);
}

function createEnv() {
  return {
    '*': (a, b) => a * b,
    'pi': Math.PI,
    'begin': (...args) => args[args.length - 1],
  };
}

function eval(ast, env) {
  if (typeof ast == 'string') {
    return env[ast];
  } else if (typeof ast == 'number') {
    return ast;
  } else if (ast[0] == 'if') {
    let test, conseq, alt;
    [_, test, conseq, alt] = ast;
    let exp = eval(test, env) ? conceq : alt;
    return eval(exp, env)
  } else if (ast[0] == 'define') {
    let symbol, exp;
    [_, symbol, exp] = ast;
    env[symbol] = eval(exp, env);
    return;
  } else {
    let proc = eval(ast[0], env);
    let args = ast.slice(1, ast.length).map(arg => eval(arg, env));
    return proc(...args);
  }
}

function pushResult(result) {
  const resultElement = document.createElement('p');
  resultElement.innerText = result;
  const parent = document.body;
  const sibling = parent.children[0].nextSibling;
  parent.insertBefore(resultElement, sibling);
}

function onInput(element) {
  if (event.key === 'Enter') {
    evalRepl(element);
  }
}

function evalRepl(element) {
  const program = element.value;
  const ast = parse(program);
  const env = createEnv();
  const result = eval(ast, env);
  pushResult(program);
  pushResult('=> ' + String(result));
  element.value = '';
}

const inputField = document.body.children[0];
const defaultProgram = '(begin (define r 10) (* pi (* r r)))';
inputField.value = defaultProgram;
evalRepl(inputField);