import { UserError } from "../../Utils/BackEndUtils";
import { gcd } from "./Factors";

export class Fraction {
    numerator:number;
    denominator:number;
    constructor(numerator:number,denominator:number){
        this.numerator = numerator;
        this.denominator = denominator;
        if (denominator == 0) throw new UserError("Fraction denominators mustn't be 0!");
        this.simplify();
    }
    add(other:Fraction|number){
        if (other instanceof Fraction){
            if (this.denominator !== other.denominator){
                return new Fraction(
                    (this.numerator * other.denominator) + (other.numerator * this.denominator),
                    this.denominator * other.denominator
                );
            } else {
                return new Fraction(
                    this.numerator + other.numerator,
                    this.denominator
                );
            }
        }
        return new Fraction(
            this.numerator + (other * this.denominator),
            this.denominator
        );
    }
    sub(other:Fraction|number){
        if (other instanceof Fraction) other.numerator *= -1;
        else other *= -1;
        return this.add(other);
    }
    mult(other:Fraction|number){
        if (other instanceof Fraction){
            return new Fraction(
                this.numerator * other.numerator,
                this.denominator * other.denominator
            );
        }
        return new Fraction(this.numerator * other,this.denominator);
    }
    div(other:Fraction|number){
        if (other instanceof Fraction) return this.mult(other.flip())
        else return this.mult(new Fraction(1,other));
    }
    flip(){return new Fraction(this.denominator,this.numerator)}
    simplify(){
        let GCD = gcd(this.numerator,this.denominator);
        this.numerator /= GCD;
        this.denominator /= GCD;
    }
    toMixedFraction(): string {
        let wholeNumber = Math.floor(this.numerator/this.denominator);
        return (wholeNumber ? wholeNumber.toString() : '') + ' ' + (this.numerator % this.denominator == 0 ? "" : new Fraction(
            this.numerator % this.denominator,
            this.denominator
        ).toString());
    }
    toDecimal(){
        return this.numerator/this.denominator;
    }
    toString(){
        return this.numerator + '/' + this.denominator;
    }
}