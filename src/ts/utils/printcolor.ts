enum Colors {
    reset = "\x1b[0m",
    bright = "\x1b[1m",
    dim = "\x1b[2m",
    underscore = "\x1b[4m",
    blink = "\x1b[5m",
    reverse = "\x1b[7m",
    hidden = "\x1b[8m"
}

export enum Foreground {
    black = "\x1b[30m",
    red = "\x1b[31m",
    green = "\x1b[32m",
    yellow = "\x1b[33m",
    blue = "\x1b[34m",
    magenta = "\x1b[35m",
    cyan = "\x1b[36m",
    white = "\x1b[37m",
    gray = "\x1b[90m",
}

export enum Background {
    black = "\x1b[40m",
    red = "\x1b[41m",
    green = "\x1b[42m",
    yellow = "\x1b[43m",
    blue = "\x1b[44m",
    magenta = "\x1b[45m",
    cyan = "\x1b[46m",
    white = "\x1b[47m",
    gray = "\x1b[100m",
}

class Color {
  public fg?: Foreground
  public bg?: Background
  constructor(
    parameters: { fg?: Foreground, bg?: Background }
  ) {
    this.fg = parameters.fg;
    this.bg = parameters.bg;
  }
}
export function colorlog(s: string, ...colors: Color[]) {
  return s
    .split("%<")
    .map((val, i) => {
      const bg = colors.at(i)?.bg ?? ""
      const fg = colors.at(i)?.fg ?? ""
      return val
        .replace("%>", `${bg}${fg}`) + Colors.reset
    }) 
    .join("")
}

function colorizeText() {}
function colorizeJSON() {}
function formatJSON() {}

console.log(
  colorlog(
    "%>[WARN]%<: You did a %>very%< bad.",
    new Color({bg: Background.yellow, fg: Foreground.black}),
    new Color({fg: Foreground.red})
  )
)
