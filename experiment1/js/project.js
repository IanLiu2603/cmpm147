const fillers = {
  team: [
    "Warriors",
    "Lakers",
    "Kings",
    "Clippers",
    "Nuggets",
    "Thunder",
    "Rockets",
    "Suns",
    "Spurs",
    "Jazz",
    "Timberwolves",
    "Mavericks",
    "Trail Blazers",
    "Pelicans",
    "Grizzlies",
    "Cavaliers",
    "Celtics",
    "Knicks",
    "Pacers",
    "Pistons",
    "Magic",
    "Heat",
    "Bucks",
    "Bulls",
    "Hawks",
    "Raptors",
    "Nets",
    "76ers",
    "Hornets",
    "Wizards",
  ],
  age: ["19", "18", "22", "20"],
  height: [
    "5 foot 10 inches",
    "6 foot 3 inches",
    "6 foot 7 inches",
    "6 foot 4 inches",
    "6 foot 9 inches",
    "7 foot",
    "6 foot 6 inches",
  ],
  weight: ["185", "225", "190", "200", "215", "180"],
  shooting: [
    "Stephen Curry",
    "Michael Porter Jr.",
    "Taj Gibson",
    "Scoot Henderson",
    "Shake Milton",
    "Oscar Tshiebwe",
  ],
  defense: [
    "Draymond Green",
    "Rudy Gobert",
    "Luka Doncic",
    "Jamychal Green",
    "Amen Thompson",
  ],
  handles: [
    "Kyrie Irving",
    "Rudy Gobert",
    "Jared McCain",
    "Stephen Curry",
    "Giannis Antetokounmpo",
  ],
  finishing: [
    "Klay Thompson",
    "Victor Oladipo",
    "Anthony Lamb",
    "Kyrie Irving",
    "Taurean Prince",
  ],
  iq: [
    "Nikola Jokic",
    "Draymond Green",
    "PJ Tucker",
    "Bones Hyland",
    "Buddy Hield",
  ],
};

const template = `With the first pick in the 2052 Draft, the $team select Ian Liu Jr.\n
At age $age, Ian Liu Jr. is listed at $height, $weight.\n
After his run in the NCAA March Madness Tournament, scouts compared his shooting to $shooting\n
His former college coaches compared his defensive prowess to $defense and his iq to $iq\n
After watching him at the combine, we believe he dribbles like $handles and finishes around the rim like $finishing`;

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();
