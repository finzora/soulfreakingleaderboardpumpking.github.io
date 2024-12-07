all_towers.sort((a, b) => a["diff"] - b["diff"]);
for (t = 0; t < all_towers.length; t++) {
  all_towers[t]["rank"] = all_towers.length - t;
  all_towers[t]["exp"] = Math.floor((3 ** ((all_towers[t]["diff"] - 800) / 100)) * 100);
}
var towers = all_towers;
for (player = 0; player < all_completions.length; player++) {
  all_completions[player]["exp"] = get_total_exp(all_completions[player]["name"]);
}
all_completions.sort((a, b) => b["exp"] - a["exp"]);
for (player = 0; player < all_completions.length; player++) {
  all_completions[player]["rank"] = player + 1;
}
var completions = all_completions;
function g(element_id) {
  return document.getElementById(element_id);
}
g("sclp-tower-search").addEventListener("keypress", function(event) {
  if (event.key == "Enter") {
    towers = search(g("sclp-tower-search").value);
    list_towers();
  }
})
g("sclp-player-search").addEventListener("keypress", function(event) {
  if (event.key == "Enter") {
    completions = psearch(g("sclp-player-search").value);
    list_players();
  }
})
function difficulty_to_name(d) {
  if (d < 900) {return "Insane";}
  if (d < 1000) {return "Extreme";}
  if (d < 1100) {return "Terrifying";}
  if (d < 1200) {return "Catastrophic";}
  if (d < 1300) {return "Horrific";}
  if (d < 1400) {return "Unreal";}
  return "Nil";
}
function difficulty_to_range(d) {
  d %= 100;
  if (d < 11) {return "Bottom";}
  if (d < 22) {return "Bottom-Low";}
  if (d < 33) {return "Low";}
  if (d < 45) {return "Low-Mid";}
  if (d < 56) {return "Mid";}
  if (d < 67) {return "Mid-High";}
  if (d < 78) {return "High";}
  if (d < 89) {return "High-Peak";}
  return "Peak";
}
function format_difficulty(d) {
  s = d.toString();
  return s.slice(0, s.length - 2) + "," + s.slice(s.length - 2, s.length + 1);
}
function format_location(a) {
  s = "";
  for (j = 0; j < a.length; j++) {
    l = a[j];
    s += l[0];
    if (l[1] != "") {
      s += ", " + l[1];
    }
    if (j != a.length - 1) {
      s += " / ";
    }
  }
  return s;
}
function search(s) {
  new_towers = [];
  for (tower_search = 0; tower_search < all_towers.length; tower_search++) {
    tower = all_towers[tower_search];
    if (tower["abbr"].toLowerCase().includes(s.toLowerCase()) || tower["name"].toLowerCase().includes(s.toLowerCase())) {
      new_towers.push(tower)
    }
  }
  return new_towers;
}
function tower_from_id(id) {
  for (i = 0; i < all_towers.length; i++) {
    if (all_towers[i]["id"] == id) {
      return all_towers[i];
    }
  }
}
function get_victors(id) {
  victors = 0;
  for (p = 0; p < all_completions.length; p++) {
    if (all_completions[p]["completions"].includes(id) ){
      victors += 1;
    }
  }
  return victors;
}
function open_extra(id) {
  var tower = tower_from_id(id);
  var extra = "";
  extra += "<p id='big'><b>(" + tower["abbr"] + ")</b> " + tower["name"] + "</p>";
  extra += "<b id=\"" + difficulty_to_name(tower["diff"]) + "\">[*] </b> Difficulty: " + difficulty_to_range(tower["diff"]) + " " + difficulty_to_name(tower["diff"]) + " (" + format_difficulty(tower["diff"]) + ")";
  extra += "<br>Location: " + format_location(tower["places"]);
  if (format_location(tower["places"]) == "Place") {
    extra += " <a href='" + tower["game"] + "' target='_blank'>(Game link)</a>";
  }
  extra += "<br>Rank: #" + tower["rank"];
  extra += "<br>EXP for completion: " + tower["exp"];
  extra += "<br>Victors: " + get_victors(id);
  extra += "<br><i id='small'>Tower ID: " + id + "</i>";
  g("extra-data").innerHTML = extra;
}
function list_towers() {
  var t = "";
  for (i = 0; i < towers.length; i++) {
    t_id = towers[i]["id"];
    t_abbr = towers[i]["abbr"];
    t_name = towers[i]["name"];
    t_diff = towers[i]["diff"];
    t_area = towers[i]["places"];
    t_rank = towers[i]["rank"];

    t += "<p id='item" + difficulty_to_name(t_diff) + "'>";
    t += "<b>(" + t_abbr + ") </b>" + t_name;
    t += " <button id='info-button' onclick='open_extra(" + t_id + ")'>+</button>"
    t += "<br><i id='small'>";
    t += format_difficulty(t_diff) + " - " + format_location(t_area) + " - #" + t_rank;
    t += "</i></p>";
  }
  g("searchmenu").innerHTML = t;
}
list_towers();





// player leaderboard
function player_from_name(name) {
  for (i = 0; i < all_completions.length; i++) {
    if (all_completions[i]["name"] == name) {
      return all_completions[i];
    }
  }
}
function format_level(exp) {
  current_level = 0;
  last_exp = 150;
  total = 0;
  if (exp < 175) {
    return "0 (" + exp + "/175)";
  }
  while (total <= exp) {
    current_level += 1;
    last_exp = 150 + (25 * (current_level ** 2));
    total += last_exp;
  }
  return (current_level - 1) + " (" + (exp - (total - last_exp)) + "/" + (150 + (25 * (current_level ** 2))) + ")";
}
function get_total_exp(player) {
  c = player_from_name(player)["completions"];
  total_exp = 0;
  for (comp_index = 0; comp_index < c.length; comp_index++) {
    total_exp += tower_from_id(c[comp_index])["exp"]
  }
  return total_exp;
}
function psearch(s) {
  new_players = [];
  for (player_search = 0; player_search < all_completions.length; player_search++) {
    player = all_completions[player_search];
    if (player["name"].toLowerCase().includes(s.toLowerCase())) {
      new_players.push(player)
    }
  }
  return new_players;
}
function format_comps(c) {
  f = "";
  for (t = all_towers.length - 1; t >= 0; t--) {
    if (c.includes(all_towers[t]["id"])) {
      tower = all_towers[t];
      f += "<b id=\"" + difficulty_to_name(tower["diff"]) + "\">[*] </b>"
      f += "<b>(" + tower["abbr"] + ") </b>" + tower["name"];
      f += " <i id='small'>";
      f += format_difficulty(tower["diff"]) + " - #" + tower["rank"];
      f += "</i><br>";
    }
  }
  return f;
}
function open_player(name) {
  var player = player_from_name(name);
  var extra = "";
  extra += "<p id='big'><b>" + name + "</b></p>";
  extra += "<br>Total EXP: " + player["exp"];
  extra += "<br>Level: " + format_level(player["exp"]);
  extra += "<br>Rank: #" + player["rank"];
  extra += "<br><br><b>Completions:</b><br>";
  extra += format_comps(player["completions"]);
  g("player-data").innerHTML = extra;
}
function list_players() {
  var p = "";
  for (i = 0; i < completions.length; i++) {
    p_name = completions[i]["name"];
    p_comps = completions[i]["completions"];
    p_exp = completions[i]["exp"];
    p_rank = completions[i]["rank"];

    p += "<p id='item'>";
    p += "<b>[" + (i + 1) + "] </b>"
    p += p_name;
    p += " <button id='info-button' onclick='open_player(\"" + p_name + "\")'>+</button>"
    p += "<br><i id='small'>";
    p += p_comps.length + " Completions - " + p_exp + " EXP - Level " + format_level(p_exp) + " - #" + p_rank;
    p += "</i></p>";
  }
  g("leaderboard").innerHTML = p;
}
list_players();
