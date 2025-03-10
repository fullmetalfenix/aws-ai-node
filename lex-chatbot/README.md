# Amazon Lex Chatbot

![screenshot goes here](./lex.png)

### Project Summary

This project was undertaken to better familiarize myself with deploying an Amazon Web Services chatbot through there Lex service. I made a bot that takes a reservation for a user and holds it for 24 hours. Note: it communicates with the user, taking input and confirming orders but I did not actually hook it to anything to hold the reservation as this is just a demo.

### Project details

This was a little bit different as you spend more time in the AWS console than you do in the code. You have to go to the lex dashboard and click 'create bot'. I used a traditional bot for this project -> name -> description then selected "Create a role with basic Amazon Lex permissions.". Please read C.O.P.P.A. and select for your use case (I did not need it as I was just intending to connect in development). Note: The language of the bot menus took the most time to learn in this whole project. Once my bot was created I went into the bot menu and set up some "intents". "Intents" are basically tracts that you want your bot to be able to go down - they map to actions you want your bot to preform. You can connect Lex to Lambda, DynamoDB, S3 etc. to do everything from appointment scheduling, answering queries, submitting orders and more but here I just set it up to respond to customer's in a mock reservation system for a product. I did that with Three intents:

1 - "Greeting":  name and description are for yourself. The 'utterances' are the important part of 'intents' - they are what trigger the action / engage the intent. For my greeting one I made one, 'hello" - note - the traditional lex bot will not respond to hey, hi, or long sentences with 'hello' in them but short introductions with the word hello or just 'hello' will trigger a response defined in the next section "Initial response". I mad mine an introduction "Hello, I am reserve-o-bot! How can I help you?". You can do a lot more with intents but this was it for the greeting part.

2 - "Reserve_a_game": My main intent. I set one utterance - "I want to reserve a game". This is a bit more flexible with a longer utterance so "I would really like to reserve a game" etc will be picked up by this one. The initial response I set is "ok I will help you reserve the game" - after that it differs from the other intents because I use this one to collect a bit of information. I added two slots: username and name to prompt the user for there name and the name of the game they want. Both solicit responses from the user, then using this information I move on to the conformation area where I state back to the user 'so {name} is the game you would like to reserve?' - if they give a positive response (yes) then it says back "ok {username}! Done - its yours - you have 24 hours to pick it up." You can also configure a response for a no. That was it for this intent, so I configured the closing response to be "Bye!"

3- "FallbackIntent" - this is the last intent I set up for this - a catch all for user input that is not understood. You could respond with a list of things the bot can do or other helpful information but as this was just a demo I set it to just do a initial response of "Sorry, the only thing you can do with this bot is reserve a game.". 

