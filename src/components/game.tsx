import React from 'react';
import { get, CurrentUser, GameServer } from "../components/constants";

const GRAVITY = 500;
const FORCE_MULTIPLIER = 3;
const MAX_AIM_LENGTH = 200;

let projectiles = [];
let tanks = new Map();
let aiming: boolean = false;

let mouse_x: number = 0;
let mouse_y: number = 0;

let game_ws: WebSocket = null;
let tank_image = null;
let barrel_image = null;
let broken_image = null;

let falling_sand = [];

class Terrain {
  heightmap: number[];
  size: number;

  get_at(x: number) {
    return this.heightmap[Math.floor(x)];
  }

  set_at(x: number, y: number) {
    this.heightmap[Math.floor(x)] = Math.floor(y);
  }

  set_heightmap(heightmap: number[]) {
    this.heightmap = heightmap;
    this.size = heightmap.length;
  }

  apply(from: number, changes: number[]) {
    console.log("SERVER APPLY");
    changes = changes.reverse();
    for (let x = from; x < from + changes.length; x++) {
      if (this.heightmap[x] <= changes[x - from][1]) {
        falling_sand.push({
          x: x,
          y: changes[x - from][1],
          column_height: this.heightmap[x] - changes[x - from][1],
        });
        this.heightmap[x] =
          changes[x - from][0] + (changes[x - from][1] - this.heightmap[x]);
      }
      else {
        this.heightmap[x] = changes[x - from][0];
      }

    }

  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(0, this.heightmap[0]);
    for (let x = 0; x < this.size; x++) {
      ctx.lineTo(x, this.heightmap[x]);
    }
    ctx.lineTo(this.size, 1000);
    ctx.lineTo(0, 1000);
    ctx.fillStyle = "black";
    ctx.fill()
  }
}

const terrain = new Terrain();

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
  let [x, y] = my_tank.get_firing_point();
  console.log(x)
  console.log(camera_x)
  let dx = mouse_x - x - camera_x;
  let dy = mouse_y - y;
  let length = Math.sqrt(dx * dx + dy * dy);
  let theta = Math.atan2(dy, dx);
  let final_x = x + Math.cos(theta) * clamp(length, 0, MAX_AIM_LENGTH);
  let final_y = y + Math.sin(theta) * clamp(length, 0, MAX_AIM_LENGTH);
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

  update(_dt: number, _extra: number) {
    console.error("update() called on base Object");
  }
}

class Projectile extends GameObject {
  size: number;
  color: string;
  x_velocity: number;
  y_velocity: number;
  id: string
  constructor(x, y, size, color, id) {
    super(x, y);
    this.size = size;
    this.color = color;
    this.x_velocity = 0;
    this.y_velocity = 0;
    this.id = id
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(dt: number, wind: number) {
    this.x = +(this.x + this.x_velocity * dt).toFixed(2);
    this.y = +(this.y + this.y_velocity * dt).toFixed(2);

    this.y_velocity = +(this.y_velocity + GRAVITY * dt).toFixed(2);
    this.x_velocity = +(this.x_velocity + wind * dt).toFixed(2);
  }
}

class Tank extends GameObject {
  color: string;
  username: string;
  image: any;
  barrel_image: any;
  broken_image: any;
  barrel_angle: number = 0;
  team: number;
  y_velocity: number = 0;
  hp: number = 200;
  draw(ctx: CanvasRenderingContext2D) {
    /*ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();*/
    ctx.drawImage(this.image, this.x - 12, this.y - 20, 30, 21);
    if (this.hp > 0) {
      let xloc = this.x + 3;
      let yloc = this.y - 16;
      ctx.translate(xloc, yloc);
      ctx.rotate(this.barrel_angle)
      ctx.drawImage(this.barrel_image, 0, -4, 16, 8)
      ctx.rotate(-this.barrel_angle)
      ctx.translate(-xloc, -yloc)
    }
    ctx.fillStyle = "black"
    ctx.textAlign = "center";
    ctx.fillText(this.username + "-" + this.team.toString(), this.x, this.y - 20);
    ctx.fillText(
      this.hp.toString(),
      this.x,
      this.y - 40
    );
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  }

  set_barrel_angle(angle: number) {
    this.barrel_angle = angle;
  }

  fire(angle, force, id) {
    let [x, y] = this.get_firing_point();
    let proj = new Projectile(+(x).toFixed(2), +(y).toFixed(2), 3, "#000000", id);
    proj.x_velocity = +(Math.cos(angle) * force).toFixed(2);
    proj.y_velocity = +(Math.sin(angle) * force).toFixed(2);
    console.log(proj.x_velocity, proj.y_velocity)
    projectiles.push(proj);
  }

  get_firing_point() {
    return [this.x + 3, this.y - 16];
  }

  update(dt: number) {
    let t_pos = terrain.get_at(this.x);
    if (this.y < t_pos) {
      this.y_velocity += 5;
      this.y += this.y_velocity * dt;
    }
    else {
      this.y = t_pos;
      this.y_velocity = 0;
    }
  }
}

let my_tank = new Tank(50, 50);
let canvas: HTMLCanvasElement = null;
let left_scroller: HTMLElement = null;
let right_scroller: HTMLElement = null;

let last_step: number = 0;

let prepared_fire_x = 0;
let prepared_fire_y = 0;

let game_state = "GAME_STATE_PREGAME";
let turn_state = "TURN_STATE_WAITING";
let have_players = 0
let need_players = 0

function fitToContainer(canvas) {
  // Make it visually fill the positioned parent
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

let turn_end_time: number = 0
let freeze_countdown: boolean = false;
let wind_speed: number = 0;

let sand_velocity = 0;
let game_over = false;
let victors = [];

let camera_x = 0;
let camera_scroll_direction = 0;
let camera_scroll_speed = 3;

let queue_started_at: number = 0;

function game_loop(now: number) {
  fitToContainer(canvas)
  const delta = (now - last_step) / 1000;
  let ctx = canvas.getContext("2d");
  if (terrain.size) {
    camera_x -= camera_scroll_speed * camera_scroll_direction;
    camera_x = Math.min(0, camera_x);
    camera_x = Math.max(-(terrain.size - ctx.canvas.clientWidth), camera_x)

    let left_scroller_shown = true;
    let right_scroller_shown = true;
    if (camera_x == 0) {
      left_scroller_shown = false;
    } else if (camera_x == -(terrain.size - ctx.canvas.clientWidth)) {
      right_scroller_shown = false;
    }
    if (left_scroller_shown) {
      left_scroller.style.display = "flex";
    }
    else {
      left_scroller.style.display = "none";
    }
    if (right_scroller_shown) {
      right_scroller.style.display = "flex";
    }
    else {
      right_scroller.style.display = "none";
    }
  }
  if (game_state == "GAME_STATE_PREGAME" && need_players != 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deffont = ctx.font;
    ctx.font = "30px Comic Sans MS";
    ctx.textAlign = "center"
    ctx.fillText("Players: " + have_players.toString() + "/" + need_players.toString(), canvas.clientWidth / 2, canvas.clientHeight / 2);
    ctx.fillText("Elapsed time: " + (new Date(Date.now() - queue_started_at).toISOString().slice(14, 19)), canvas.clientWidth / 2, (canvas.clientHeight / 2) + 30);
    ctx.font = deffont;
  }
  else if (game_state == "GAME_STATE_PLAYING") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(camera_x, 0);
    terrain.draw(ctx);
    for (let proj of projectiles) {
      proj.update(delta, wind_speed);
      proj.draw(ctx);
    }
    if (aiming) {
      prepared_fire_x = 0;
      prepared_fire_y = 0;

      let [final_x, final_y] = get_aim_loc();
      let [aim_x, aim_y] = get_aim_loc();
      let [x, y] = my_tank.get_firing_point();
      let angle = Math.atan2(aim_y - y, aim_x - x)
      my_tank.set_barrel_angle(angle)
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(final_x, final_y);
      ctx.stroke();
    }
    if (prepared_fire_x) {
      let [x, y] = my_tank.get_firing_point();
      ctx.beginPath();
      ctx.setLineDash([5, 5])
      ctx.moveTo(x, y);
      ctx.lineTo(prepared_fire_x, prepared_fire_y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    for (let tank of tanks.values()) {
      tank.update(delta);
      tank.draw(ctx);
    }
    if (falling_sand.length) {
      sand_velocity += 3;
    }
    else {
      sand_velocity = 0;
    }
    for (let sand of falling_sand) {
      sand.y += sand_velocity;
      if (sand.y >= terrain.get_at(sand.x)) {
        falling_sand.splice(falling_sand.indexOf(sand), 1);
        terrain.set_at(sand.x, terrain.get_at(sand.x) + sand.column_height)
      }
      ctx.beginPath();
      ctx.moveTo(sand.x, sand.y);
      ctx.lineTo(sand.x, sand.y + sand.column_height);
      ctx.stroke();
    }
    ctx.translate(-camera_x, 0);
    ctx.fillStyle = "black"
    ctx.textAlign = "center";
    let deffont = ctx.font;
    ctx.font = "30px Comic Sans MS";
    if (game_over) {
      ctx.fillText("Game over!", ctx.canvas.clientWidth / 2, 30);
      ctx.fillText("Winners: " + victors.join(", "), ctx.canvas.clientWidth / 2, 60);
    }
    else {
      if (freeze_countdown) {
        ctx.fillText("In progress...", ctx.canvas.clientWidth / 2, 30);
      }
      else {
        ctx.fillText(Math.round(Math.max(0, (10 + (turn_end_time - Date.now()) / 1000))).toString(), ctx.canvas.clientWidth / 2, 30);
        ctx.font = "16px Comic Sans MS";
        if (wind_speed < 0) {
          ctx.fillText("< " + wind_speed.toFixed(0) + "  ", ctx.canvas.clientWidth / 2, 50);
        }
        else if (wind_speed > 0) {
          ctx.fillText("  " + wind_speed.toFixed(0) + " >", ctx.canvas.clientWidth / 2, 50);
        }
        else {
          ctx.fillText("  " + wind_speed.toFixed(0) + "  ", ctx.canvas.clientWidth / 2, 50);
        }
      }
    }
    ctx.font = deffont;
  }
  last_step = now;
  requestAnimationFrame(game_loop);
}

function recolor_image(image, color) {
  let color_canvas = document.createElement("canvas");
  let tank_canvas = document.createElement("canvas");
  let cctx = color_canvas.getContext("2d");
  let tctx = tank_canvas.getContext("2d");
  color_canvas.width = image.width;
  color_canvas.height = image.height;
  tank_canvas.width = image.width;
  tank_canvas.height = image.height;
  cctx.drawImage(image, 0, 0);
  cctx.globalCompositeOperation = 'source-atop';
  cctx.fillStyle = color;
  cctx.fillRect(0, 0, image.width, image.height);
  cctx.globalCompositeOperation = 'source-over';
  tctx.drawImage(image, 0, 0);
  tctx.globalCompositeOperation = 'color';
  tctx.drawImage(color_canvas, 0, 0);
  tctx.globalCompositeOperation = 'source-over';
  let new_image = new Image()
  new_image.src = tank_canvas.toDataURL("image/png");
  tank_canvas.remove();
  color_canvas.remove();
  return new_image
}

function connect(addr) {
  game_ws = new WebSocket(addr);
  game_ws.onopen = function (_event) {
    queue_started_at = Date.now();
    game_ws.send(JSON.stringify(CurrentUser.token))
    requestAnimationFrame(game_loop);
  };
  game_ws.onmessage = function (msg) {
    console.log(msg.data);
    let data = JSON.parse(msg.data);
    if (data.type == "your tank") {
      my_tank = new Tank(data.x, data.y);
      my_tank.color = "blue";
      my_tank.username = data.username;
      my_tank.image = recolor_image(tank_image, my_tank.color);
      my_tank.barrel_image = recolor_image(barrel_image, my_tank.color)
      my_tank.broken_image = recolor_image(broken_image, my_tank.color)
      my_tank.team = data.team;
      camera_x = -(data.x - canvas.clientWidth / 2);
      tanks.set(my_tank.username, my_tank);
    }
    else if (data.type == "enemy tank") {
      let asshole = new Tank(data.x, data.y);
      asshole.username = data.username
      asshole.color = "red";
      asshole.image = recolor_image(tank_image, asshole.color);
      asshole.barrel_image = recolor_image(barrel_image, asshole.color);
      asshole.broken_image = recolor_image(broken_image, asshole.color);
      asshole.team = data.team;
      tanks.set(data.username, asshole);
    }
    else if (data.type == "fire") {
      tanks.get(data.player).fire(data.angle, data.force, data.projectile_id);
      tanks.get(data.player).set_barrel_angle(data.angle);
      prepared_fire_x = 0;
      prepared_fire_y = 0;
    }
    else if (data.type == "event_player_count") {
      have_players = data.have
      need_players = data.need
    }
    else if (data.type == "event_game_start") {
      game_state = "GAME_STATE_PLAYING"
      turn_end_time = Date.now();
    }
    else if (data.type == "turn_ended") {
      turn_state = "TURN_STATE_RUNNING"
      freeze_countdown = true;
    }
    else if (data.type == "terrain") {
      terrain.set_heightmap(data.terrain);
    }
    else if (data.type == "impact") {
      terrain.apply(data.start_point, data.modifications)
      projectiles = projectiles.filter((p) => { return p.id != data.projectile_id });
    }
    else if (data.type == "next_turn") {
      turn_end_time = Date.now();
      freeze_countdown = false;
      prepared_fire_x = 0;
      prepared_fire_y = 0;
      turn_state = "TURN_STATE_WAITING";
    }
    else if (data.type == "damage") {
      tanks.get(data.player).hp -= data.amount;
    }
    else if (data.type == "death") {
      let tank = tanks.get(data.player)
      tank.image = tank.broken_image;
    }
    else if (data.type == "victory") {
      game_over = true
      victors = data.victors;
    }
    else if (data.type == "wind") {
      wind_speed = data.strength;
    }
  }
  game_ws.onclose = function (ev) {
    console.log("closing");
    console.log(ev.code);
  };
}

export default class Game extends React.Component {

  componentDidMount() {
    canvas = this.refs.game as HTMLCanvasElement;
    fitToContainer(canvas);
    tank_image = new Image();
    tank_image.crossOrigin = "anonymous"
    tank_image.src = require("../public/tank.png").default;
    tank_image.onload = () => {
      barrel_image = new Image();
      barrel_image.crossOrigin = "anonymous"
      barrel_image.src = require("../public/tank_barrel.png").default
      barrel_image.onload = () => {
        broken_image = new Image()
        broken_image.crossOrigin = "anonymous"
        broken_image.src = require("../public/tank_broken.png").default
        broken_image.onload = () => {
          if (GameServer.address) {
            connect(GameServer.address);
          } else {
            get("/game/request/").then(res => {
              connect(res.data);
            });
          }
        }
      }
    }
    canvas.addEventListener("mousedown", _ev => {
      if (turn_state == "TURN_STATE_WAITING") {
        aiming = true;
      }

    });

    canvas.addEventListener("mouseup", _ev => {
      if (!aiming) {
        return;
      }
      aiming = false;
      let [a_x, a_y] = get_aim_loc();
      [prepared_fire_x, prepared_fire_y] = [a_x, a_y]
      a_x -= my_tank.x;
      a_y -= my_tank.y;
      let length = Math.sqrt(a_x * a_x + a_y * a_y);
      let theta = Math.atan2(a_y, a_x);
      //my_tank.fire(theta, length * FORCE_MULTIPLIER);
      game_ws.send(
        JSON.stringify({
          type: "fire",
          angle: theta,
          force: length * FORCE_MULTIPLIER
        })
      );
    });

    canvas.addEventListener("mousemove", ev => {
      //camera_scroll_direction = 0;
      [mouse_x, mouse_y] = get_mouse_pos(canvas, ev);
      /*if (mouse_x < 100) {
        console.log("moving left")
        
        camera_scroll_direction = -1;
      }
      else if (mouse_x > canvas.clientWidth - 100) {
        console.log("moving right")
        camera_scroll_direction = 1;
      }*/
    });

    right_scroller = this.refs.scroll_right as HTMLElement;
    right_scroller.addEventListener("mousedown", _ev => {
      camera_scroll_direction = 1;
    })
    right_scroller.addEventListener("mouseup", _ev => {
      camera_scroll_direction = 0;
    })

    left_scroller = this.refs.scroll_left as HTMLElement;
    left_scroller.addEventListener("mousedown", _ev => {
      camera_scroll_direction = -1;
    })
    left_scroller.addEventListener("mouseup", _ev => {
      camera_scroll_direction = 0;
    })

    //requestAnimationFrame(game_loop);
  }

  public render(): JSX.Element {
    return (
      <div className="game_container">
        <div ref="scroll_right" className="canvas_scroll_right">
          {">"}
        </div>
        <canvas ref="game"></canvas>
        <div ref="scroll_left" className="canvas_scroll_left">
          {"<"}
        </div>
      </div>
    );
  }
}