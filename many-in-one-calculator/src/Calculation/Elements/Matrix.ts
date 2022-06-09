import { UserError } from "../../Utils";

export class Matrix {
    mat:number[][];
    constructor(mat:number[][]){
        this.mat = mat;
    }
    get length():[number,number]{
        return [this.mat.length,this.mat?.[0]?.length ?? 0];
    }
    add(other:Matrix|number): Matrix {
        const length = this.length;
        let returned = Matrix.empty(length[0],length[1]);
        if (other instanceof Matrix){
            if (this.length === other.length) throw new UserError(`Cannot add matrices of sizes (${this.length}) and (${other.length}). Addition must involve matrices of equal size`);
            for (let r = 0; r < length[0]; r++){
                for (let c = 0; c < length[1]; c++){
                    returned.mat[r][c] = this.mat[r][c] + other.mat[r][c];
                }
            }
        } else {
            for (let r = 0; r < length[0]; r++){
                for (let c = 0; c < length[1]; c++){
                    returned.mat[r][c] = this.mat[r][c] + other;
                }
            }
        }
        return returned;
    }
    mult(other:Matrix):Matrix{
        const length = this.length;
        const otherlen = other.length;
        let returned:Matrix;
        if (otherlen[0] !== length[1]) throw new UserError(`Cannot multiply matrices of sizes (${this.length}) and (${other.length}). Number of columns of the first matrix must equal the number of rows of the second.`);
        returned = Matrix.empty(length[0],otherlen[1]);
        for (let i = 0; i < length[0]; i++){
            for (let j = 0; j < otherlen[1]; j++){
                for (let k = 0; k < length[1]; k++){
                    returned.mat[i][j] += this.mat[i][k] * other.mat[k][j];
                }
            }
        }
        return returned;
    }
    dot(other:Matrix|number): Matrix {
        const length = this.length;
        let returned = Matrix.empty(length[0],length[1]);
        if (other instanceof Matrix){
            for (let r = 0; r < length[0]; r++){
                for (let c = 0; c < length[1]; c++){
                    returned.mat[r][c] = this.mat[r][c] * other.mat[r][c];
                }
            }
        } else {
            for (let r = 0; r < length[0]; r++){
                for (let c = 0; c < length[1]; c++){
                    returned.mat[r][c] = this.mat[r][c] * other;
                }
            }
        }
        return returned;
    }
    transpose(): Matrix {
        const length = this.length;
        let returned = Matrix.empty(length[1],length[0]);
        for (let r = 0; r < length[0]; r++){
            for (let c = 0; c < length[1]; c++){
                returned.mat[c][r] = this.mat[r][c];
            }
        }
        return returned;
    }
    get determinant():number {
        const length = this.length;
        if (length[0] !== length[1]) throw new UserError(`Cannot find the determinant of matrix with sizes ${length}. Only square matrices have determinants.`);
        return Matrix._detRecurse(this.mat,this.length[0]);
    }
    inverse():Matrix {
        const length = this.length;
        if (length[0] !== length[1]) throw new UserError(`Cannot invert matrices with sizes ${length}. Only square matrices can be inverted.`);
        const determinant = this.determinant;
        if (determinant === 0) throw new UserError("Cannot find the inverted form of this matrix as its determinant is 0");

        const detrecipro = 1/determinant;
        let returned = Matrix.empty(length[0],length[1]);
        let sign = 1;
        for (let r = 0; r < length[0]; r++){
            for (let c = 0; c < length[1]; c++){
                Matrix._getCofactor(this.mat,returned.mat,r,c,length[0]);
                returned.mat[r][c] *= -1;
                sign *= -1;
                console.log(returned.mat);
            }
        }
        returned = returned.transpose().dot(detrecipro);
        return returned;
    }
    // CREDIT: https://www.geeksforgeeks.org/determinant-of-a-matrix/
    private static _getCofactor(mat:number[][], temp:number[][], bannedRow:number, bannedColumn:number, size:number){
        let cofactR = 0, cofactC = 0;
        for (let r = 0; r < size; r++){
            for (let c = 0; c < size; c++){
                if (r != bannedRow && c != bannedColumn){
                    temp[cofactR][cofactC++] = mat[r][c];
                    if (cofactC === size-1){cofactC = 0; cofactR++}
                }
            }
        }
    }
    private static _detRecurse(mat:number[][],size:number){
        let determinant = 0;
        if (size == 1) return mat[0][0];
        let temp:number[][] = [];
        for (let r = 0; r < size; r++){
            temp.push([]);
            for (let c = 0; c < size; c++){
                temp[r].push(0);
            }
        }
        let sign = 1;
        for (let c = 0; c < size; c++){
            Matrix._getCofactor(mat,temp,0,c,size);
            determinant += sign * mat[0][c] * Matrix._detRecurse(temp,size-1);
            sign*=-1;
        }
        return determinant;
    }
    static empty(rows:number,columns:number): Matrix {
        let mat:number[][] = [];
        for (let r = 0; r < rows; r++){
            mat.push([]);
            for (let c = 0; c < columns; c++) mat[r].push(0);
        }
        return new Matrix(mat);
    }
    static identity(size:number): Matrix {
        let mat:number[][] = [];
        for (let r = 0; r < size; r++){
            mat.push([]);
            for (let c = 0; c < size; c++) mat[r].push(r == c ? 1 : 0);
        }
        return new Matrix(mat);
    }
    toString(){
        return this.mat.toString();
    }
}

// console.log(Matrix.empty(3,3));
console.log(new Matrix([[1,2],[3,4]]).add(new Matrix([[2,2],[2,2]])));
console.log(new Matrix([[1,2],[3,4]]).mult(new Matrix([[3],[4]])));
console.log(new Matrix([[1,2]]).transpose());
console.log(new Matrix([[1,2],[3,4]]).determinant);
console.log(new Matrix([[1,2],[3,4]]).inverse());
