function createBinaryGeneratorPool(length) {
    let generators = [];
    if (savedata.enableDistinction)
        generators.push(createDistinctionGenerator(length));
    if (savedata.enableLinear)
        generators.push(...createLinearGenerators(length));
    if (savedata.enableSyllogism)
        generators.push(createSyllogismGenerator(length));
    if (savedata.enableDirection)
        generators.push(createDirectionGenerator(length));
    if (savedata.enableDirection3D)
        generators.push(createDirection3DGenerator(length));
    if (savedata.enableDirection4D)
        generators.push(createDirection4DGenerator(length));
    return generators;
}


function getBinaryCountdown(offset=0) {
    return savedata.overrideBinaryTime ? savedata.overrideBinaryTime + offset : null;
}

// Binary operation functions to avoid eval()
const binaryOps = [
    (a, b) => a && b,           // AND
    (a, b) => !(a && b),        // NAND
    (a, b) => a || b,           // OR
    (a, b) => !(a || b),        // NOR
    (a, b) => a !== b,          // XOR
    (a, b) => a === b           // XNOR
];

class BinaryQuestion {
    create(length) {
        length = Math.max(4, length);

        const operandNames = [
            "AND",
            "NAND",
            "OR",
            "NOR",
            "XOR",
            "XNOR"
        ];

        const operandTemplates = [
            '$a <div class="is-connector">and</div> $b',
            '<div class="is-connector"></div> $a <div class="is-connector">nand</div> $b <div class="is-connector">are true</div>',
            '$a <div class="is-connector">or</div> $b',
            '<div class="is-connector">Neither</div> $a <div class="is-connector">nor</div> $b',
            '<div class="is-connector">Either</div> $a <div class="is-connector">or</div> $b',
            '<div class="is-connector">Both</div> $a <div class="is-connector">and</div> $b <div class="is-connector">are the same</div>'
        ];

        const pool = createBinaryGeneratorPool();
        let choice;
        let choice2;
        let premises;
        let conclusion = "";
        const flip = coinFlip();
        let isValid;
        const operandIndex = Math.floor(Math.random()*binaryOps.length);
        while (flip !== isValid) {
            let [generator, generator2] = pickRandomItems(pool, 2).picked;

            [choice, choice2] = [
                generator.question.create(Math.floor(length/2)),
                generator2.question.create(Math.ceil(length/2))
            ];
    
            premises = [...choice.premises, ...choice2.premises];
            premises = scramble(premises);
    
            conclusion = operandTemplates[operandIndex]
                .replace("$a", choice.conclusion)
                .replace("$b", choice2.conclusion);

            // Use direct function call instead of eval()
            isValid = binaryOps[operandIndex](choice.isValid, choice2.isValid);
        }

        const countdown = getBinaryCountdown();
        return {
            category: `Binary: ${choice.category} ${operandNames[operandIndex]} ${choice2.category}`,
            type: "binary",
            modifiers: ['op1'],
            startedAt: new Date().getTime(),
            subresults: [choice, choice2],
            isValid,
            premises,
            conclusion,
            ...(countdown && { countdown }),
        };
    }
}

class NestedBinaryQuestion {
    create(length) {
        const humanOperands = [
            '<span class="is-connector DEPTH">(</span>à<span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">AND</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>ò<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>à<span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">NAND</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>ò<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>à<span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">OR</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>ò<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>à<span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">NOR</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>ò<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>à<span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">XOR</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>ò<span class="is-connector DEPTH">)</span>',
            '<span class="is-connector DEPTH">(</span>à<span class="is-connector DEPTH">)</span> <span class="is-connector DEPTH">XNOR</span><br><span class="INDENT"></span><span class="is-connector DEPTH">(</span>ò<span class="is-connector DEPTH">)</span>'
        ];

        const pool = createBinaryGeneratorPool();

        length = Math.max(4, length);
        const halfLength = Math.floor(length / 2);
        const questions = Array(halfLength).fill(0)
            .map(() => pool[Math.floor(Math.random() * pool.length)].question.create(2));

        let numOperands = +savedata.maxNestedBinaryDepth;
        // Ensure numOperands is valid
        if (!numOperands || numOperands < 1) numOperands = 1;
        
        let i = 0;
        function generator(remaining, depth) {
            remaining--;
            const left = Math.floor(Math.random() * Math.max(0, remaining));
            const right = Math.max(0, remaining) - left;
            const rndIndex = Math.floor(Math.random() * humanOperands.length);
            const humanOperand = humanOperands[rndIndex];
            const opIndex = rndIndex; // Store the operation index for evaluation
            const val = (left > 0)
                ? generator(left, depth+1)
                : (i++) % halfLength;
            const val2 = (right > 0)
                ? generator(right, depth+1)
                : (i++) % halfLength;
            const letter = String.fromCharCode(97 + depth);
            
            // Check if val/val2 are numbers (leaf nodes) or objects (recursive results)
            const isValNumber = typeof val === 'number';
            const isVal2Number = typeof val2 === 'number';
            
            return {
                human: humanOperand
                    .replaceAll('DEPTH', 'depth-' + letter)
                    .replaceAll('INDENT', 'indent-' + letter)
                    .replace('à', isValNumber ? val : val.human)
                    .replace('ò', isVal2Number ? val2 : val2.human),
                // Store evaluation data instead of string expression
                evalData: {
                    opIndex: opIndex,
                    left: isValNumber ? { type: 'leaf', index: val } : val.evalData,
                    right: isVal2Number ? { type: 'leaf', index: val2 } : val2.evalData
                }
            };
        }

        const generated = generator(numOperands, 0);

        // Recursive function to evaluate the expression tree without eval()
        function evaluate(node) {
            if (node.type === 'leaf') {
                return questions[node.index].isValid;
            }
            const leftVal = evaluate(node.left);
            const rightVal = evaluate(node.right);
            return binaryOps[node.opIndex](leftVal, rightVal);
        }

        const category = Object.keys(
            questions
                .map(q => q.category)
                .reduce((a, c) => (a[c] = 1, a), {})
        )
        .join('/');
        
        const isValid = evaluate(generated.evalData);
        const premises = questions.reduce((a, q) => [ ...a, ...q.premises ], []);
        const conclusion = generated.human.replaceAll(/(\d+)/g, m => questions[m].conclusion);
        const countdown = getBinaryCountdown();

        return {
            category: `Nested Binary: ${category}`,
            type: "binary",
            modifiers: [`op${numOperands}`],
            startedAt: new Date().getTime(),
            subresults: questions,
            isValid,
            premises,
            conclusion,
            ...(countdown && { countdown }),
        };
    }
}

function createBinaryGenerator(length) {
    return {
        question: new BinaryQuestion(),
        premiseCount: getPremisesFor('overrideBinaryPremises', length),
        weight: 100,
    };
}

function createNestedBinaryGenerator(length) {
    return {
        question: new NestedBinaryQuestion(),
        premiseCount: getPremisesFor('overrideBinaryPremises', length),
        weight: 100,
    };
}
