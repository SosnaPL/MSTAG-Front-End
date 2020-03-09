/* export default class GameContent {

  public GRAVITY = 300;
  public MAX_AIM_LENGTH = 200;
  public FORCE_MULTIPLIER = 3;
  public ws = null;

  clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
  };

  get_mouse_pos(elem, event) {
    let bounds = elem.getBoundingClientRect();
    let x = event.x - bounds.left;
    let y = event.y - bounds.top;
    return [x, y]
  }

  class GameObject {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    draw(ctx: CanvasRenderingContext2D) {
      console.error("draw() called on base Object");
    }

    update(dt: number) {
      console.error("update() called on base Object");
    }
  }

  class Projectile extends GameObject {
    size: number;
    color: string;
    x_velocity: number;
    y_velocity: number;
    constructor(x, y, size, color) {
      super(x, y);
      this.size = size;
      this.color = color;
      this.x_velocity = 0;
      this.y_velocity = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update(dt) {
      if (this.y >= 500) {
        return;
      }
      this.x += this.x_velocity * dt;
      this.y += this.y_velocity * dt;

      this.y_velocity += GRAVITY * dt;
    }
  }

  class Tank extends GameObject {
    color: string;
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    fire(angle, force) {
      console.log(force);
      let proj = new Projectile(this.x, this.y, 3, "#000000");
      proj.x_velocity = Math.cos(angle) * force;
      proj.y_velocity = Math.sin(angle) * force;
      console.log(proj.x_velocity);
      console.log(proj.y_velocity);
      projectiles.push(proj);
    }
  }

  function fix_dpi() {
    let canvas = document.getElementById("game");
    let dpi = window.devicePixelRatio;
    let style = {
      height() {
        return +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
      },
      width() {
        return +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
      }
    }
    canvas.setAttribute('width', (style.width() * dpi).toString());
    canvas.setAttribute('height', (style.height() * dpi).toString());
  }

  let projectiles = [];//new Projectile(50, 400, 3, "#000000")];
  let canvas = document.getElementById("game") as HTMLCanvasElement;
  let my_tank = null;
  let enemy_tank = null;

  let aiming = false;
  let mouse_x, mouse_y = 0;

  function get_aim_loc() {
    let dx = mouse_x - my_tank.x;
    let dy = mouse_y - my_tank.y;
    let length = Math.sqrt(dx * dx + dy * dy);
    let theta = Math.atan2(dy, dx);
    let final_x = my_tank.x + Math.cos(theta) * clamp(length, 0, MAX_AIM_LENGTH);
    let final_y = my_tank.y + Math.sin(theta) * clamp(length, 0, MAX_AIM_LENGTH);
    return [final_x, final_y];
  }

  canvas.addEventListener("mousedown", (ev) => {
    console.log("aiming");
    aiming = true;
  });

  canvas.addEventListener("mouseup", (ev) => {
    aiming = false;
    let [a_x, a_y] = get_aim_loc();
    a_x -= my_tank.x;
    a_y -= my_tank.y;
    let length = Math.sqrt(a_x * a_x + a_y * a_y);
    console.log(length);
    let theta = Math.atan2(a_y, a_x);
    my_tank.fire(theta, length * FORCE_MULTIPLIER);
    ws.send(JSON.stringify({ type: "fire", angle: theta, force: length * FORCE_MULTIPLIER }));
  });

  canvas.addEventListener("mousemove", (ev) => {
    [mouse_x, mouse_y] = get_mouse_pos(canvas, ev);
  });

  fix_dpi();
  function draw() {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let proj of projectiles) {
      proj.update(0.016);
      proj.draw(ctx);
    }
    my_tank.draw(ctx);
    if (enemy_tank) {
      enemy_tank.draw(ctx);
    }
    if (aiming) {
      let [final_x, final_y] = get_aim_loc();
      ctx.beginPath();
      ctx.moveTo(my_tank.x, my_tank.y);
      ctx.lineTo(final_x, final_y);
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }

  window.onload = function () {
    ws = new WebSocket("ws://25.64.141.174:8765");
    ws.onopen = function (event) {
      console.log("uhh?");
    };
    ws.onmessage = function (msg) {
      console.log(msg.data);
      let data = JSON.parse(msg.data);

      if (data.type == "your tank") {
        my_tank = new Tank(data.x, data.y);
        my_tank.color = "blue";
        requestAnimationFrame(draw);
      }
      else if (data.type == "enemy tank") {
        enemy_tank = new Tank(data.x, data.y);
        enemy_tank.color = "red";
      }
      else if (data.type == "fire") {
        console.log(enemy_tank.x, enemy_tank.y);
        enemy_tank.fire(data.angle, data.force);
      }
    }
    ws.onclose = function (ev) {
      console.log("closing");
      console.log(ev.code);
    }
  }
}
 */
