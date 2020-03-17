# strooped-relay
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/455a41cf230948869e4bed43f6e54bce)](https://app.codacy.com/gh/Strooped/strooped-relay?utm_source=github.com&utm_medium=referral&utm_content=Strooped/strooped-relay&utm_campaign=Badge_Grade_Dashboard)

## Dataset colors

Colors are extracted from https://htmlcolorcodes.com/color-names/, using some custom JavaScript, and stores as json
in `public/colors.json`.

### Attributes

- **name** - Human readable name of the color
- **color** - Hex code for this color
- **family** - Which overall family this color belongs to (red, blue, etc.). 
               Can be used to give more difficult tasks, by only using a single color family 

```js
let colors = [];

// Finds each color row and maps it into a dictionary containg name, code and which colorFamily
// it belongs
for (let row of document.getElementsByClassName('color')) {
    let colorFamily = row.parentNode.parentNode.parentNode.id;
    let name = row.getElementsByClassName('color-name')[0].textContent.trim();
    
    let colorCode = row.getElementsByClassName('color-hex')[0].textContent.trim();
    
    colors.push({ name, color: colorCode, family: colorFamily })
}

// Dumped to the console
JSON.stringify(colors);
```
