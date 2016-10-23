class PosfixSolver {

    validateInfix(infix) {
        let balance = 0;
        // remove white spaces to simplify regex
        infix = infix.replace(/\s/g, '');

        // if it has empty parenthesis then is not valid
        if (/\(\)/.test(infix)) {
            return false;
        }

        // valid values: integers and identifiers
        //let value = '(\\d+w*)';
        let value = '(\\d+|[a-zA-Z_]\\w*)';
        // the unary '+' and '-'
        let unaryOper = '[\\+\\-]?';
        // the arithmetic operators
        let arithOper = '[\\+\\-\\*\\/]';
        // the comparison operators
        let compOper = '(\\<\\=?|\\>\\=?|\\=\\=|\\!\\=)';

        // if it has more than one comparison operator then is not valid
        let regexExp = new RegExp(compOper, 'g');
        if (infix.match(!regexExp || regexExp.length > 1)) {
            return false;
        }

        // the combined final regex: /[\+\-]?(\d+|[a-zA-Z_]\w*)(([\+\-\*\/]|(\<\=?|\>\=?|\=\=|\!\=))[\+\-]?(\d+|[a-zA-Z_]\w*))*/
        let regex = new RegExp(unaryOper + value + '((' + arithOper + '|' + compOper + ')' + unaryOper + value + ')*');
        // validate parenthesis balance
        for (let i = 0; i < infix.length; i++) {
            if (infix[i] == '(') {
                balance++;
            }
            else if (infix[i] == ')') {
                balance--;
            }

            if (balance < 0) {
                return false;
            }
        }

        if (balance > 0) {
            return false;
        }

        // remove all the parenthesis
        infix = infix.replace(/[\(\)]/g, '');

        return regex.test(infix);
    }

    infixToPostfix(infix) {
        let outputQueue = "";
        let operatorStack = [];
        let operators = {
            "^": {
                precedence: 4,
                associativity: "Right"
            },
            "/": {
                precedence: 3,
                associativity: "Left"
            },
            "*": {
                precedence: 3,
                associativity: "Left"
            },
            "+": {
                precedence: 2,
                associativity: "Left"
            },
            "-": {
                precedence: 2,
                associativity: "Left"
            }
        };
        infix = infix.replace(/\s+/g, "");
        infix = infix.split(/([\+\-\*\/\^\(\)])/).clean();
        infix.forEach((token)=>{
            if(token.isNumeric() || token.isChar()) {
                outputQueue += token + " ";
            } else if("^*/+-".indexOf(token) !== -1) {
                let o1 = token;
                let o2 = operatorStack[operatorStack.length - 1];
                while("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                    outputQueue += operatorStack.pop() + " ";
                    o2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(o1);
            } else if(token === "(") {
                operatorStack.push(token);
            } else if(token === ")") {
                while(operatorStack[operatorStack.length - 1] !== "(") {
                    outputQueue += operatorStack.pop() + " ";
                }
                operatorStack.pop();
            }
        });
        while(operatorStack.length > 0) {
            outputQueue += operatorStack.pop() + " ";
        }
        return outputQueue.trim();
    }

    solvePosfix(postfix) {
        let resultStack = [];
        postfix = postfix.trim().split(" ");
        postfix.forEach((char)=>{
            if(char.isNumeric()) {
                resultStack.push(char);
            } else {
                let a = resultStack.pop();
                let b = resultStack.pop();
                if(char === "+") {
                    resultStack.push(parseInt(a) + parseInt(b));
                } else if(char === "-") {
                    resultStack.push(parseInt(b) - parseInt(a));
                } else if(char === "*") {
                    resultStack.push(parseInt(a) * parseInt(b));
                } else if(char === "/") {
                    resultStack.push(parseInt(b) / parseInt(a));
                } else if(char === "^") {
                    resultStack.push(Math.pow(parseInt(b), parseInt(a)));
                }
            }
        });
        if(resultStack.length > 1) {
            return "error";
        } else {
            return resultStack.pop();
        }
    }
 
}

export default PosfixSolver