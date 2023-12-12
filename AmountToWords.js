
// Function to run on page load
document.addEventListener("DOMContentLoaded", function () {
    // Get the amount parameter from the URL
    var amountParam = getParameterByName("amount");

    // If the amount parameter is present, set it in the input and convert to words
    if (amountParam !== null) {
        document.getElementById("amountInput").value = amountParam;
        convertAmountToWords();
    }
});

// to extract amount parameter from URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


// to get the amount inserted and pass it to the another function
function convertAmountToWords() {
    var amountInput = document.getElementById("amountInput").value;

    var splittedNum = amountInput.toString().split('.');
    var nonDecimal = splittedNum[0];
    var decimal = splittedNum[1] || "0";

    if(decimal == "0"){
        var result = price_in_words(Number(nonDecimal)) + " Rupees";
    }
    else{
        var result = price_in_words(Number(nonDecimal)) + "Rupees";
    }
    

    if (decimal !== "0") {
        result += " and" + price_in_words(Number(decimal)) + "paise";
    }

    document.getElementById("amountInWordsOutput").value = result;
}

// to convert the input numbers into words
function price_in_words(amount) {
    var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
        dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
        tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
        
        handle_tens = function (dgt, prevDgt) {
            return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
        },
        
        handle_utlc = function (dgt, nxtDgt, denom) {
            return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
        };

    var str = "", digitIdx = 0, digit = 0, nxtDigit = 0, words = [];

    if (amount === "" || isNaN(parseInt(amount))) {
        str = "";
    } 
    else if (parseInt(amount) > 0 && amount.toString().length <= 10) {
        for (digitIdx = amount.toString().length - 1; digitIdx >= 0; digitIdx--) {
            digit = amount.toString()[digitIdx] - 0;
            nxtDigit = digitIdx > 0 ? amount.toString()[digitIdx - 1] - 0 : 0;

            switch (amount.toString().length - digitIdx - 1) {
                case 0:
                    words.push(handle_utlc(digit, nxtDigit, ""));
                    break;
                case 1:
                    words.push(handle_tens(digit, amount.toString()[digitIdx + 1]));
                    break;
                case 2:
                    words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != amount.toString()[digitIdx +
                        1] && 0 != amount.toString()[digitIdx + 2] ? " and" : "") : "");
                    break;
                case 3:
                    words.push(handle_utlc(digit, nxtDigit, "Thousand"));
                    break;
                case 4:
                    words.push(handle_tens(digit, amount.toString()[digitIdx + 1]));
                    break;
                case 5:
                    words.push(handle_utlc(digit, nxtDigit, "Lakh"));
                    break;
                case 6:
                    words.push(handle_tens(digit, amount.toString()[digitIdx + 1]));
                    break;
                case 7:
                    words.push(handle_utlc(digit, nxtDigit, "Crore"));
                    break;
                case 8:
                    words.push(handle_tens(digit, amount.toString()[digitIdx + 1]));
                    break;
                case 9:
                    words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != amount.toString()[digitIdx +
                        1] || 0 != amount.toString()[digitIdx + 2] ? " and" : " Crore") : "");
            }
        }
        str = words.reverse().join("");
    } 
    else {
        str = "";
    }
    return str;
}