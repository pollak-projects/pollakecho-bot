const msg = "aalsdlas askAAAalés fasz ajsAAAAbjas aLKSJDFLKAnajsdasjf ksdjfkashfuida geci ";
const swear = require('./swear_words.json');

swear.forEach(word => {
    if (msg.includes(word)) {
        console.log(">:O\n PURPLE 😂😁😀")
    }
})