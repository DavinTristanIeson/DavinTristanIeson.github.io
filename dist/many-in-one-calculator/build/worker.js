const callers = {
    isPrime(number){
        if (number == 2) return true;
        else if (number <= 1 || number % 2 == 0) return false;
        for (let i = 3; i*i <= number; i+=2){
            if (number % i == 0) return false;
        }
        return true;
    },
    getFactorsOf(number){
        const factors= [];
        for (let i = 1; i*i <= number; i++){
            if (number % i === 0){
                factors.push([i,number/i]);
            }
        }
        return factors;
    },
    getFactorTree(number){
        let factors = [];
        while (number > 1){
            if (number % 2 === 0){
                number /= 2;
                factors.push(2);
            } else break;
        }
        let divider = 3;
        while (number > 1 && divider <= number){
            if (number % divider === 0){
                factors.push(divider);
                number /= divider;
            } else divider+=2;
        }
        return factors.length === 0 ? [1,number] : factors;
    },
    modularExponentiation(x, y, p) {
        // https://www.geeksforgeeks.org/modular-exponentiation-power-in-modular-arithmetic/
        let res = 1;
        x = x % p;
        if (x == 0)
            return 0;
        while (y > 0){
            if (y & 1) res = (res * x) % p;
            y = y >> 1;
            x = (x * x) % p;
        }
        return res;
    },
    moduloGenerator(base,mod) {
        const generator = [];
        for (let i = 1; i < mod; i++){
            generator.push(this.modularExponentiation(base,i,mod));
        }
        return generator;
    },
    isPrimitiveRoot(generatedModulo){
        const uniques = new Set(generatedModulo);
        return uniques.size === generatedModulo.length;
    },
    primitiveRootOf(mod) {
        // the modder must be prime
        if (!this.isPrime(mod)) return [];
        // starting from root 2 since root 1 is impossible... I think
        const primitiveRoots = [];
        for (let r = 2; r < mod+1; r++){
            const generated = this.moduloGenerator(r,mod);
            if (this.isPrimitiveRoot(generated)){
                primitiveRoots.push(r);
            }
        }
        return primitiveRoots;
    },
    discreteLogarithm(root,mod,value) {
        let uniques = new Set();
        let returnValue = null;
        for (let i = 1; i < mod; i++){
            let powed = this.modularExponentiation(root,i,mod);
            // not instantly returned as we need to check if the root is a proper primitive root or not
            if (powed === value) returnValue = i;
            if (uniques.has(powed)) return null;
            uniques.add(powed);
        }
        return returnValue;
    },
    factorial(from,to=1) {
        let returned = 1;
        while (from > to){
            returned *= from;
            from--;
        }
        return returned;
    },
    combination(n, r) {
        if (n-r < r) return this.factorial(n,r)/this.factorial(n-r);
        else return this.factorial(n,n-r)/this.factorial(r);
    },
    fibonacci(length){
        let returned = [1,1];
        if (length <= 1) return returned.splice(0,length+1);
        for (let i = 2; i < length; i++){
            if (returned[i-1] === Infinity) break;
            returned.push(returned[i-1]+returned[i-2]);
        }
        return returned;
    },
    pascalTriangle(from,to){
        let sequence = [];
        for (let r = from; r <= to; r++){
            sequence.push([]);
            for (let c = 0; c <= r; c++){
                sequence[r-from].push(this.combination(r,c))
                console.log(this.combination(r,c),r,c);
            }
        }
        return sequence;
    }
}


self.onmessage = (e) => {
    let result;
    try {
        result = callers[e.data.type](...e.data.args);
    } catch (e){
        console.error(e);
    }
    self.postMessage(result);
}