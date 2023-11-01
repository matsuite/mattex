function between(x, min, max) {
  return x >= min && x <= max;
}
var rtd = (rad) => (rad * 180) / Math.PI;

class Vector1 {
  constructor(x) {
    this.x = x;
  }
  add(v) {
    return new Vector1(this.x + v.x);
  }
  sub(v) {
    return new Vector1(this.x - v.x);
  }
  mul(v) {
    return new Vector1(this.x * v.x);
  }
  div(v) {
    return new Vector1(this.x / v.x);
  }
  sqrt() {
    return new Vector1(Math.sqrt(this.x));
  }
  pow(v) {
    return this.ipow(v.x);
  }
  ipow(i) {
    return new Vector1(Math.pow(this.x, i));
  }
  abs() {
    return new Vector1(Math.abs(this.x));
  }
  signFlip() {
    return new Vector1(this.x * -1);
  }
  neg() {
    return new Vector1(Math.abs(this.x) * -1);
  }
}
class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  sub(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }
  mul(v) {
    return new Vector2(this.x * v.x, this.y * v.y);
  }
  div(v) {
    return new Vector2(this.x / v.x, this.y / v.y);
  }
  pow(v) {
    return this.ipow(v.x);
  }
  ipow(i) {
    return new Vector2(Math.pow(this.x, i), Math.pow(this.y, i));
  }
}
const EARTH_ACCEL = new Vector1(9.8);
const AIR_DRAG_COEFF = new Vector1(0.05);
const AIR_RHO = new Vector1(1.225);
const EARTH_SETTINGS = [AIR_RHO, EARTH_ACCEL, AIR_DRAG_COEFF, EARTH_ACCEL];
function radians(v) {
  return (v * Math.PI) / 180;
}
function vu1motion(v, u, acceleration, time) {
  return new Vector1(0.5).mul(v.add(u)).mul(time);
}
function d2motionNoV_t(d, v, g, t) {
  v_x = v.x;
  x = d.x + v.x * t.x;
  v_y = v.y - g.x * t.x;
  y = d.y + v.y * t.x - (1 / 2) * g.x * Math.pow(t.x, 2);
  return [new Vector2(v_x, v_y), new Vector2(x, y), g, t];
}
function terminalVelocity(m, g, rho, A, C_d) {
  // rho = density
  return new Vector1(Math.sqrt((2 * m.x * g.x) / (rho.x * A.x * C_d.x)));
}
function projMotion(d, v, m, rho, a, C_d, g, t) {
  v_t = terminalVelocity(m, g, rho, a, C_d);
  v_x = v.x;
  x = d.x + v.x * t.x;
  v_y = v.y - g.x * t.x;
  y = d.y + v.y * t.x + (1 / 2) * g.x * Math.pow(t.x, 2);
  return [
    new Vector2(
      Math.abs(v_x) > v_t.x
        ? v_x < 0
          ? -Math.abs(v_t.x)
          : Math.abs(v_t.x)
        : v_x,
      Math.abs(v_y) > v_t.x
        ? v_y < 0
          ? -Math.abs(v_t.x)
          : Math.abs(v_t.x)
        : v_y,
    ),
    new Vector2(x, y),
    g,
    t,
  ];
}
/*function inelasticCollision(V_i, M) {
	return new Vector2((V_i.x*(M.x/(M.x+M.y)))+(V_i.y*(M.y/(M.x+M.y))));
}*/
function elasticCollision(d, d2, Vv, V2v, m, theta, phi) {
  var V = new Vector2(magnitude(d, Vv), magnitude(d2, V2v));
  var v = Vv;
  var vd_1x =
    ((V.x * Math.cos(theta.x - phi.x) * (m.x - m.y) +
      2 * m.y * v.y * Math.cos(theta.y - phi.x)) /
      (m.x + m.y)) *
      Math.cos(phi.x) +
    v.x * Math.sin(theta.x - phi.x) * Math.cos(phi.x + Math.PI / 2);
  var vd_1y =
    ((V.x * Math.cos(theta.x - phi.x) * (m.x - m.y) +
      2 * m.y * v.y * Math.cos(theta.y - phi.x)) /
      (m.x + m.y)) *
      Math.sin(phi.x) +
    v.x * Math.sin(theta.x - phi.x) * Math.sin(phi.x + Math.PI / 2);
  var vd_2x =
    ((V.y * Math.cos(theta.y - phi.x) * (m.y - m.x) +
      2 * m.x * v.x * Math.cos(theta.x - phi.x)) /
      (m.y + m.x)) *
      Math.cos(phi.x) +
    v.y * Math.sin(theta.y - phi.x) * Math.cos(phi.x + Math.PI / 2);
  var vd_2y =
    ((V.y * Math.cos(theta.y - phi.x) * (m.y - m.x) +
      2 * m.x * v.x * Math.cos(theta.x - phi.x)) /
      (m.y + m.x)) *
      Math.sin(phi.x) +
    v.y * Math.sin(theta.y - phi.x) * Math.sin(phi.x + Math.PI / 2);
  return [new Vector2(vd_1x, vd_1y), new Vector2(vd_2x, vd_2y)];
}
function didCollide(d, d2, s) {
  return (
    (between(d.x, d2.x, d2.x + s.x) && between(d.y, d2.y, d2.y + s.x)) ||
    (between(d2.x, d.x, d.x + s.x) && between(d2.y, d.y, d.y + s.x))
  );
}
function sides(d, v) {
  return new Vector2(v.x - d.x, v.y - d.y);
}
function pythag(a, b) {
  return Math.sqrt(a * a + b * b);
}
function magnitude(d, v) {
  var sideLengths = sides(d, v);
  return pythag(sideLengths.x, sideLengths.y);
}
function angleOfCollision(d, d2) {
  angle_of_collision = new Vector1(angle(d.x, d.y, d2.x, d2.y));
}
function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  return theta;
}
/*function quad(a,b,c) {
	return [ // x = 
			b.signFlip().add( // -b+
			( // sqrt(
				b.ipow(2) // b^2
				.sub(new Vector1(4).mul(a).mul(c)) // -4ac
			).sqrt()) // )
			.div(new Vector1(2).add(a)), // /2a
			b.signFlip().sub( // -b-
			( // sqrt(
				b.ipow(2) // b^2
				.sub(new Vector1(4).mul(a).mul(c)) // -4ac
			).sqrt()) // )
			.div(new Vector1(2).add(a)) // /2a
		]
}*/

// render
const BLANK2 = new Vector2(0, 0);
class sObject {
  constructor(mass, size, pos, properties) {
    this.m = mass;
    this.s = size;
    this.dp = pos;
    this.p = pos;
    this.prop = properties;
    this.v = new Vector2(0, 0);
  }
  accelerate(velocity) {
    this.v = this.v.add(velocity);
  }
  reset() {
    this.v = BLANK2;
    this.p = this.dp;
  }
  projectileMotion(time) {
    var n = projMotion(this.p, this.v, this.m, ...this.prop, time);
    this.v = n[0];
    this.p = n[1];
    return n;
  }
  elasticCollision(otherObject, time) {
    var d = this.p;
    var d2 = otherObject.p;
    var v = this.v;
    var v2 = otherObject.v;
    var m = this.m;
    var m2 = otherObject.m;
    var collision_results;
    if (didCollide(d, d2, this.s)) {
      //console.log(v, v2);
      var combined_m = new Vector2(m2.x, m.x);
      var angle_of_collision = new Vector1(angle(d.x, d.y, d2.x, d2.y));
      //console.log(angle_of_collision);
      var v_angle = new Vector1(angle(d.x, d.y, d.x + v.x, d.y + v.y));
      var v2_angle = new Vector1(angle(d2.x, d2.y, d2.x + v2.x, d2.y + v2.y));
      collision_results = elasticCollision(
        d,
        d2,
        v,
        v2,
        combined_m,
        new Vector2(v_angle.x, v2_angle.x),
        angle_of_collision,
      );
      //collision_results[0] = BLANK2.sub(collision_results[0])
      //collision_results[1] = BLANK2.sub(collision_results[1])
    } else {
      collision_results = [v, v2];
    }
    this.projectileMotion(time);
    otherObject.projectileMotion(time);
    return collision_results;
  }
}

var physics = {
  name: "physics",
  version: "v1.0.0",
  requires: [],
  optionalRequires: [],
  optFuncs: {},
  description: "Adds support for basic projectile physics to mattex.",
  funcs: {
    p_obj(x, y, w, h, m, prop = EARTH_SETTINGS) {
      return new sObject(
        new Vector1(m),
        new Vector2(w, h),
        new Vector2(x, y),
        prop,
      );
    },
    p_rect(obj, colprop, prop) {
      this.rect(obj.p.x, -obj.p.y, obj.s.x, obj.s.y, colprop, prop);
    },
  },
};
