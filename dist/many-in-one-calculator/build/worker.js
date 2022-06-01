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