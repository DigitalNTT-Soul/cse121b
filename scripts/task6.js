// import * as Math from 'mathjs'

// Write a function to parse a stringified dice expression
function parseAndRoll(expressionString) {
    // use a regular expression to find all instances of "<num>d<num>" (a die-roll indicator)
    // "roll" the dice, and replace each die-roll indicator in the original string with the results of the die-roll
    return expressionString.replaceAll(/(\d+)d(\d+)/ig,
        function(match, p1, p2) {
            // in case multiple dice are rolled in a single die-roll, wrap the entire result set for each die-roll in parentheses
            let str = "("
            // use a for-loop to iterate through each die of a die-roll
            for (let i = 0; i < p1;) {
                // roll the die and append the result to the string holding the result set.
                str += Math.ceil(Math.random()*p2)
                // insert an addition operator if this die is not the last die in the roll
                if (++i < p1) str += " + "
            }
            // finish wrapping the result set in parentheses
            str += ")"
            // return the result set of the die-roll, which will then replace the die-roll indicator in the original expression
            return str
        }
    )
}

// write function that processes the entire expression as a mathematical equation after the RNG elements have been parsed, processed, and inserted
function fullExpressionProcessor(detailedResults) {
    // write a function that sandboxes the evaluation of the result string, in case the user 
    return function(detailedResults) {
        // null out certain elements in this scope for sandboxing purposes, to prevent users from accessing it from the expression entry field
        let window = null;
        let console = null;
        // declare a variable to hold the output
        let output

        // replace traditional exponent symbol with Java's exponent symbol
        //      replace it here because a layman user wouldn't understand (or need to understand) that it had been changed, or why
        detailedResults = detailedResults.replaceAll('^', '**')

        // use a try-catch block to attempt to evaluate the entered expression, but also provide the error as a result so the user can try again
        try {
            output = eval(detailedResults)
        } catch (err) {
            output = err
        }
        
        // return the output
        return output
        
    }.call([], detailedResults)
}

// declare a function to output both the summarized and detailed results to the 
function displayResults(summarized, detailed) {
    // insert the relevant results into the relevant HTML fields that are intended to hold them
    document.getElementById("summarized").innerHTML = summarized
    document.getElementById("detailed").innerHTML = detailed
}

// declare a function to drive the helper functions of the Dice Expression Processor
function processorMain() {
    // grab the user-provided expression from the relevant text entry field
    let expressionString = document.getElementById("expression").value

    // expressionString = "(1D20 ^ 2D12) * 3d10 / 4d8 + 5d6 - 6d4" // test expression

    let detailedResults = undefined
    let summarizedResult = undefined
    
    if (expressionString.includes("while") || expressionString.includes("for")) {
        summarizedResult = "Please refrain from using loops."
        detailedResults = "They cause problems."
    } else {
        // pass the expression into the function that replaces each die-roll indicator with the results of its die-roll
        detailedResults = parseAndRoll(expressionString)

        // process the full expression of detailed results into a single summarized result
        summarizedResult = fullExpressionProcessor(detailedResults)
    }

    

    // display the results by inserting them into pre-existing text fields
    displayResults(summarizedResult, detailedResults)

}

// apply listener on the button that triggers the processorMain function
document.getElementById("processButton").addEventListener("click",processorMain)

// make a quick little button listener to clear the "exprssion"s text entry field whenever the button is pressed
document.getElementById("clearButton").addEventListener("click",
    function() {
        document.getElementById("expression").value=''
    }
)

// add a listener to "expression" element that allows the user to press enter to achieve the same effect as clicking "processButton" with the mouse
document.getElementById("expression").addEventListener("keypress", function(event) {
    // make sure the pressed key is "Enter", otherwise do nothing
    if (event.key === "Enter") {
        // prevent a default action for the field, in case there is one
        event.preventDefault()
        // click the button
        document.getElementById("processButton").click()
    }
})

// insert year in copyright footer
document.getElementById('year').textContent = new Date().getFullYear()