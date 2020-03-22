import React from 'react';
import { get, CurrentUser } from "../components/constants";

const GRAVITY = 500;
const FORCE_MULTIPLIER = 3;
const MAX_AIM_LENGTH = 200;

let projectiles = [];
let tanks = new Map();
let aiming: boolean = false;

let mouse_x: number = 0;
let mouse_y: number = 0;

let game_ws: WebSocket = null;

function clamp(x, min, max) {
  return Math.min(Math.max(x, min), max);
}

function get_mouse_pos(elem, event) {
  let bounds = elem.getBoundingClientRect();
  let x = event.x - bounds.left;
  let y = event.y - bounds.top;
  return [x, y];
}

function get_aim_loc() {
  let dx = mouse_x - my_tank.x;
  let dy = mouse_y - my_tank.y;
  let length = Math.sqrt(dx * dx + dy * dy);
  let theta = Math.atan2(dy, dx);
  let final_x = my_tank.x + Math.cos(theta) * clamp(length, 0, MAX_AIM_LENGTH);
  let final_y = my_tank.y + Math.sin(theta) * clamp(length, 0, MAX_AIM_LENGTH);
  return [final_x, final_y];
}

class GameObject {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(_ctx: CanvasRenderingContext2D) {
    console.error("draw() called on base Object");
  }

  update(_dt: number) {
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
  username: string;
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.fillStyle = "black"
    ctx.textAlign = "center";
    ctx.fillText(this.username, this.x, this.y + 20);
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

let my_tank = new Tank(50, 50);
let canvas: HTMLCanvasElement = null;

let last_step: number = 0;
function game_loop(now: number) {
  const delta = (now - last_step) / 1000;
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let proj of projectiles) {
    proj.update(delta);
    proj.draw(ctx);
  }
  if (aiming) {
    let [final_x, final_y] = get_aim_loc();
    ctx.beginPath();
    ctx.moveTo(my_tank.x, my_tank.y);
    ctx.lineTo(final_x, final_y);
    ctx.stroke();
  }
  for (let tank of tanks.values()) {
    tank.draw(ctx);
  }
  last_step = now;
  requestAnimationFrame(game_loop);
}

export default class Game extends React.Component {

  componentDidMount() {
    console.log(game_ws);
    get("/game/request/").then((res) => {
      game_ws = new WebSocket(res.data);
      game_ws.onopen = function (_event) {
        game_ws.send(JSON.stringify({ type: "init", username: CurrentUser.username }));
      };
      game_ws.onmessage = function (msg) {
        console.log(msg.data);
        let data = JSON.parse(msg.data);
        if (data.type == "your tank") {
          my_tank = new Tank(data.x, data.y);
          my_tank.color = "blue";
          my_tank.username = data.username
          tanks.set(my_tank.username, my_tank);
          requestAnimationFrame(game_loop);
        }
        else if (data.type == "enemy tank") {
          let asshole = new Tank(data.x, data.y);
          asshole.username = data.username
          asshole.color = "red";
          tanks.set(data.username, asshole);
        }
        else if (data.type == "fire") {
          tanks.get(data.player).fire(data.angle, data.force);
        }
      }
      game_ws.onclose = function (ev) {
        console.log("closing");
        console.log(ev.code);
      };
    });
    canvas = this.refs.game as HTMLCanvasElement;

    canvas.addEventListener("mousedown", _ev => {
      console.log("aiming");
      aiming = true;
    });

    canvas.addEventListener("mouseup", _ev => {
      aiming = false;
      let [a_x, a_y] = get_aim_loc();
      a_x -= my_tank.x;
      a_y -= my_tank.y;
      let length = Math.sqrt(a_x * a_x + a_y * a_y);
      console.log(length);
      let theta = Math.atan2(a_y, a_x);
      my_tank.fire(theta, length * FORCE_MULTIPLIER);
      game_ws.send(
        JSON.stringify({
          type: "fire",
          angle: theta,
          force: length * FORCE_MULTIPLIER
        })
      );
    });

    canvas.addEventListener("mousemove", ev => {
      [mouse_x, mouse_y] = get_mouse_pos(canvas, ev);
    });

    //requestAnimationFrame(game_loop);
  }

  public render(): JSX.Element {
    return (
      <div className="game_container">
        <canvas ref="game" width="500px" height="500px"></canvas>
      </div>
    );
  }
}