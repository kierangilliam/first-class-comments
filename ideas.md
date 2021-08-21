# first class comments

you are sitting in economy on a plane.

in front of you is several folk sitting in first class.

you hurl comments at them. sometimes they like these comments. sometimes they don't.

a comment is interpreted by language model which generates an tag <humorous, insult, indecent>

_liking_ a comment is dependent on the personality of the person in first class

they have different personalities and requires different sentiments

> maria likes you to ask questoins about themselves
> jim likes insults
> cassandra likes compliments
> kieran likes humor

along with your comment, you can attach valid javascript. if they like the comment, they will evaluate your javascript.

syntax: <name>, <comment><. or ? or !> <valid javascript>
examples: 
> $ kieran, you are such a fat pig. if (true) console.log(“hello world”)
> kieran is insulted. they remain stagnant.
> $ maria, what is your favorite color? let x = “abc”; x + “def”
> “abcdef”
> $ cassandra, you look really sick. 1 + 2
> cassandra stares at you, blankly
> $ cassandra, you look really sick with that. 1 + 2
> “3”


instead of repl it's cemel: comment emote maybe-eval loop


### name ideas

- literally illiterate 





# lang
each citizen can only deal with a subset of the language

linus (hackernews) operates (+ / -)
reginald (insult) is unpredictable (Math.random()) 
kanye (compliments) is literal ('string' 32 true false)
socrates conditionally accepts (if else)
tina (jokes) makes comparisons (< > <= >= && ||)

x (likes when y is mad) calls functions
maria (sad quote) plans for the eventual (creates functions)

# unused: maria (sad quote), jerry (conspiracy theorist)
| maria, love is not real. only death is certain. ?
| maria, death is upon us. ?
| maria, death is upon us. ?

piping
`
socrates, why not? "if _ else _"
	| kanye, you are beautiful. "false"
		| kanye, your shirt is soo cool. "2"
    | linus, Citation File Format "_ && _"
  		| tina, Amy Poehler and I have been friends for so long, we’re like Oprah and Gale. Only we’re not denying anything. "_ < _"
			| reginald, i hope you die.
  			| kanye, your shirt is soo cool. "42"
  		| kanye, i love your eyes. "false"
	"
`

turns into
`
if (false) { 2 }
else { random() < 42 && false }
`


misc
- using the same comments over and over decreasing the chance the citizen will care