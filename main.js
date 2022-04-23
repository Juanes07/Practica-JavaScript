/**
 * constructor canvas
 */
(function () {
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
    this.playing = false;
  };
  /**
   * controla el movimiento de las barras latereles y no se extienden en si mismas
   */
  self.Board.prototype = {
    get elements() {
      var elements = this.bars.map(function (bar) {
        return bar;
      });
      elements.push(this.ball);
      return elements;
    },
  };
})();
/**
 * constructor de la pelota
 */
(function () {
  self.Ball = function (x, y, radius, board) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed_y = 0;
    this.speed_x = 3;
    this.board = board;
    this.direction = 1;
    board.ball = this;
    this.kind = "circle";
  };
  /**
   * como se maneja la velocidad de la pelota
   */
  self.Ball.prototype = {
    move: function () {
      this.x = this.x + this.speed_x * this.direction;
      this.y += this.speed_y;
    },
  };
})();
/**
 * constructor de las barras
 */
(function () {
  self.Bar = function (x, y, width, height, board) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.board = board;
    this.board.bars.push(this);
    this.kind = "rectangle";
    this.speed = 10;
  };
  /**
   * controla las velocidades de la pelota y las barras laterales
   */
  self.Bar.prototype = {
    down: function () {
      this.y += this.speed;
    },
    up: function () {
      this.y -= this.speed;
    },
    toString: function () {
      return "x: " + this.x + " y: " + this.y;
    },
  };
})();
/**
 * crea el canvas
 */
(function () {
  self.BoardView = function (canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
  };

  self.BoardView.prototype = {
    /**
     * limpia el canvas para simular la animacion de movimiento
     */
    clean: function () {
      this.ctx.clearRect(0, 0, this.board.width, this.board.height);
    },
    /**
     * dibuja el canvas
     */
    draw: function () {
      for (let i = this.board.elements.length - 1; i >= 0; i--) {
        let el = this.board.elements[i];
        draw(this.ctx, el);
      }
    },
    /**
     * empieza el juego
     */ play: function () {
      if (this.board.playing) {
        this.clean();
        this.draw();
        this.board.ball.move();
      }
    },
  };
  /**
   *
   * @param ctx contexto del canvas
   * @param element hace referencia al valor la coordenada del canvas
   */
  function draw(ctx, element) {
    // if (element !== null && element.hasOwnProperty("kind")) {
    switch (element.kind) {
      case "rectangle":
        ctx.fillRect(element.x, element.y, element.width, element.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius, 0, 7);
        ctx.fill();
        ctx.closePath();
        break;
    }
  }
})();

/**
 * iniciando los constructores para asignarle valores visibles en canvas
 */
let board = new Board(800, 400);
let bar = new Bar(20, 100, 40, 100, board);
let bar_2 = new Bar(735, 100, 40, 100, board);
let canvas = document.getElementById("canvas");
let board_view = new BoardView(canvas, board);
let ball = new Ball(350, 100, 10, board);

/**
 * Detecta las teclas presionadas para jugar
 */
document.addEventListener("keydown", function (event) {
  /**
   * Movimiento flecha arriba y abajo
   */
  if (event.keyCode == 38) {
    event.preventDefault();
    bar.up();
  } else if (event.keyCode == 40) {
    event.preventDefault();
    bar.down();
  } else if (event.keyCode === 87) {
    event.preventDefault();
    // Movimiento W
    bar_2.up();
  } else if (event.keyCode === 83) {
    event.preventDefault();
    // Movimiento S
    bar_2.down();
  } else if (event.keyCode === 32) {
    event.preventDefault();
    board.playing = !board.playing;
  }
});

/**
 * dibuja todo el canvas junto a sus elementos al cargar la pagina
 */
board_view.draw();

/**
 * Habilita la animacion por frames del movimiento del canvas
 */
window.requestAnimationFrame(controller);

setTimeout(function () {
  ball.direction = -1;
}, 4000);

/**
 * funcion de control del juego
 */
function controller() {
  board_view.play();
  // board_view.clean();
  // board_view.draw()
  window.requestAnimationFrame(controller);
}
