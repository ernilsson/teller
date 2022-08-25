# Teller
*Work in progress.*

## Description
Teller is a Discord bot with the purpose to provide communities and friend groups with a shared interactive text 
adventure. Anyone can start a game, and the one who does will then be considered the game master. The games start with 
an initial prompt, describing the beginning part of the game. Members of the channel are then presented with a variety
of options for how the story should continue. As soon as the options are presented, the voting period begins. The game 
master may decide a suitable time to close the voting and proceed the story. The highest voted option is then registered
and its consequences and subsequent options are displayed. This process continues until the story has reached its end.

## Commands
There are currently three slash commands available. These are explained in detail below.
* `/tell`
  * Starts a new game in the current channel with the commanding user as game master.
  * Requires an integer argument `id` that identifies the game to be played.
* `/vote`
  * Places a vote on one of the options to proceed the story. 
  * Requires a string argument `path` that identifies the option to vote for.
* `/step`
  * Closes the voting and furthers the story along the highest voted path.
  * Can only be called by the game master of the current game.

## Getting Teller
The plan is to host Teller so that stories can be easily shared and played by anyone. However, since the code is open 
source it will also be entirely possible to run the bot locally as long as you have a MySQL instance running with the 
required database schema. More information of how to run Teller, as well as easy set-up with Docker, will be provided once 
the project reaches a more mature state.