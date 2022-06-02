function checkBit(bit:Direction,expected:Direction){
    return ((bit & expected) !== 0);
}

export enum Direction {
    NONE = 0,
    LEFT = 1,
    RIGHT = 2,
    UP = 4,
    DOWN = 8,
}
export class FrontendUtils {
    static onEnter(e:KeyboardEvent,callback:()=>void){
        console.log(e);
        if (e.key !== "Enter") return;
        e.preventDefault();
        callback();
    }
    static onArrowChangeFocus(e:KeyboardEvent,inputElement:HTMLInputElement,direction:Direction){
        if (
            (checkBit(direction,Direction.UP) && (e.key === "ArrowUp")) ||
            (checkBit(direction,Direction.DOWN) && (e.key === "ArrowDown")) ||
            (checkBit(direction,Direction.LEFT) && (e.key === "ArrowLeft")) ||
            (checkBit(direction,Direction.RIGHT) && (e.key === "ArrowRight"))
        ){
            e.preventDefault();
            inputElement.focus();
        }
    }
}



type Vec2 = {x:number,y:number};
export class SwipeManager {
    swipeStart:Vec2|null = null;
    minDist:Vec2;
    callback: (e:TouchEvent)=>void;
    direction:Direction;
    constructor(minDist:Vec2,callback:(e:TouchEvent)=>void,direction:Direction){
        this.minDist = minDist;
        this.callback = callback;
        this.direction = direction;
    }
    onSwipeStart(e:TouchEvent){
        if (!e.touches.length) return;
        this.swipeStart = {x:e.touches[0].clientX,y:e.touches[0].clientY};
    }
    onSwipeEnd(e:TouchEvent){
        if (!e.changedTouches.length || !this.swipeStart) return;
        const swipeEnd = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
        const distance = SwipeManager.coordinateDistance(this.swipeStart,swipeEnd);
        if (checkBit(this.direction, Direction.LEFT) && distance.x < 0 && Math.abs(distance.x) >= this.minDist.x) this.callback(e);
        if (checkBit(this.direction, Direction.RIGHT) && distance.x >= 0 && Math.abs(distance.x) >= this.minDist.x) this.callback(e);
        if (checkBit(this.direction, Direction.UP) && distance.y < 0 && Math.abs(distance.y) >= this.minDist.y) this.callback(e);
        if (checkBit(this.direction, Direction.DOWN) && distance.y >= 0 && Math.abs(distance.y) >= this.minDist.y) this.callback(e);
        this.swipeStart = null;
    }
    static coordinateDistance(a:Vec2,b:Vec2): Vec2{
        return {x: b.x-a.x, y: b.y-a.y};
    }
    static euclideanDistance(a:Vec2,b:Vec2){
        return Math.sqrt((b.x-a.x)**2 + (b.y-a.y)**2);
    }
}