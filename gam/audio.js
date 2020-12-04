game_audio={
    "jump":new Audio("assets/music/jump.wav"),
    "spring":"assets/music/spring.wav",
    "gem":new Audio("assets/music/gem.wav"),
    "coin":"assets/music/coin.wav",
    "swing":"assets/music/swing.wav",
    "tutorial_music":new Audio("")
};


Object.freeze(game_audio);

console.log(game_audio.gem.duration);