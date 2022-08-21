/* Utllity functions */

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const console_start = () => {
  readline.question(`How many simulations would you like to run?\n> `, n_times => {
    results = simulate_monty(n_times)
    console_display(results)
});
}

const rand_int = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min); //Maximum  exclusive, minimum inclusive
}

const rand_indice = (arr) => {
  return rand_int(0, arr.length)
}

/* Set_up functions */

const add_goats = (stage) => {
  stage.fill({"hidden": "goat"})
}

const add_car = (stage)=> {
  stage[rand_indice(stage)] = {"hidden": "car"}
}

const set_up_stage = (door_count) => {
  stage = new Array(door_count)
  add_goats(stage)
  add_car(stage)
  return stage
}


/* Simulation and simulation helper functions */

const reveal_goat = (stage) => {
  while (true) {
    door_num = rand_indice(stage)
    if (stage[door_num].hidden == "goat") {
      stage[door_num] = {"revealed": "goat"}  // awkward use of a key as though it was a property, sue me.
      break
    }
  }
}

//randomly picks and sticks to the choice, return win/loss bool
const pick_won = (stage)=> {
  return stage[rand_indice(stage)].hidden == "car"
}

//randomly picks then switches to a non-revealed door
const pick_and_switch_won = (stage)=> {
  pick_num = rand_indice(stage)
  hidden_content = stage[pick_num].hidden
  stage[pick_num] = {"original_pick": hidden_content} // notes the pick, awkward use of a key as though it was a property, sue me.
  reveal_goat(stage)

  while (true) {
    door_num = rand_indice(stage)
    if (stage[door_num].hidden) {
      return stage[door_num].hidden == "car"
    }
  }
}

const simulate_monty = (n_times) => {
  doors = 3
  res = {"pick_wins": 0, "pick_and_switch_wins": 0, "total_picks": 0}

  for (let i = 0; i < n_times; i++) {
    if (pick_won(set_up_stage(doors))) {
      res.pick_wins += 1
    }

    if (pick_and_switch_won(set_up_stage(doors))) {
      res.pick_and_switch_wins += 1
    }

    res.total_picks += 1
  }

  return res
}

const console_display = (res) => {
  console.log(`Winrate for picking and sticking was: ${res.pick_wins/res.total_picks}%`)
  console.log("------------------------------------------------------------------------------------")
  console.log(`Winrate for picking and switching was: ${res.pick_and_switch_wins/res.total_picks}%`)
}

console_start()
