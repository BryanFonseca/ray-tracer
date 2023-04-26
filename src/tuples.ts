// Before rendering stuff, we need to be able to represent basic concepts
// such as position, direction and distance.
// A tuple is an ordered list of number which will be used to represent a point in space
// The renderer will use a left-handed coordinate system.

import { equal } from "./helpers/equal";

// [x, y, z, w] whereas w will be 1 for points and 0 for vectors.
// E.G. [4, -4, 3, 1] (a point) [-4, 4, -3, 0] (a vector)

export class Tuple {
    x: number;
    y: number;
    z: number;
    w: number;
    type: string;

    constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        if (w === 1.0) {
            this.type = "POINT";
        } else if (w === 0) {
            this.type = "VECTOR";
        } else {
            this.type = "BARE_TUPLE";
        }
    }

    // TODO: refactor to use rest operator
    add(other: Tuple): Tuple {
        const x = this.x + other.x;
        const y = this.y + other.y;
        const z = this.z + other.z;
        const w = this.w + other.w;

        if (w === 0) return new Vector(x, y, z);
        if (w === 1) return new Point(x, y, z);

        return new Tuple(x, y, z, w);
    }

    subtract(other: Tuple): Tuple {
        const x = this.x - other.x;
        const y = this.y - other.y;
        const z = this.z - other.z;
        const w = this.w - other.w;

        if (w === 0) return new Vector(x, y, z);
        if (w === 1) return new Point(x, y, z);

        return new Tuple(x, y, z, w);
    }

    negate() {
        return new Tuple(-this.x, -this.y, -this.z, -this.w);
    }

    multiply(scalar: number) {
        return new Tuple(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
    }

    divide(scalar: number) {
        return this.multiply(1 / scalar);
    }

    static areEqual(a: Tuple, b: Tuple) {
        return (
            equal(a.x, b.x) &&
            equal(a.y, b.y) &&
            equal(a.z, b.z) &&
            equal(a.w, b.w)
        );
    }
}

export class Point extends Tuple {
    constructor(x: number, y: number, z: number) {
        super(x, y, z, 1);
    }
}

export class Vector extends Tuple {
    constructor(x: number, y: number, z: number) {
        super(x, y, z, 0);
    }

    // TODO: make this a getter
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    normalize() {
        return new Vector(
            this.x / this.magnitude(),
            this.y / this.magnitude(),
            this.z / this.magnitude()
        );
    }

    static dot(a: Vector, b: Vector) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static cross(a: Vector, b: Vector) {
        return new Vector(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }
}