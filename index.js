const { version } = require("./package.json");

/**
 * Makes an empty tag.
 * @returns {Object}
 */
const makeEmptyTag = () => ({ name: "", type: "", required: false, rest: false, options: null, literal: false });

/**
 * Parses a usage tag into an object.
 * @param {String} input - The input tag.
 * @returns {Object}
 */
function parse(input) {
  // Verify the input type.
  if(typeof input !== "string") {
    throw new TypeError("Input must be a string.");
  }

  // Parsed tags are stored here.
  const tags = [];

  // The current tag we are trying to parse.
  let current = makeEmptyTag();
  // If we parsing the type, if false it means we parsing the name.
  let type = false;
  // If the previous character was a colon, to detect double colons.
  // TODO: There must be a better way to track this.
  let colon = false;

  for(const char of input) {
    if(char === " ") continue;

    if(char === "<") {
      current.required = true;
      continue;
    }

    if(char === ">") {
      if(current.name.startsWith("@@") && current.type === "") {
        current.name = current.name.slice(2);
        current.type = "member";
      } else if(current.name.startsWith("@") && current.type === "") {
        current.name = current.name.slice(1);
        current.type = "user";
      } else if(current.type === "") {
        current.type = "literal";
      }
      
      tags.push(current);
      current = makeEmptyTag();
      type = false;
      continue;
    }

    if(char === "[") {
      if(current.required) {
        throw new Error("Attempt to open an optional tag inside a required tag. e.g <[...");
      }

      continue;
    }
    
    if(char === "]") {
      if(current.name.startsWith("@@") && current.type === "") {
        current.name = current.name.slice(2);
        current.type = "member";
      } else if(current.name.startsWith("@") && current.type === "") {
        current.name = current.name.slice(1);
        current.type = "user";
      } else if(current.type === "") {
        current.type = "literal";
      }
      
      tags.push(current);
      current = makeEmptyTag();
      type = false;
      continue;
    }

    if(char === ":") {
      if(colon) {
        colon = false;
        current.literal = true;
        continue;
      }

      if(type) throw new Error("Colons can only be used once per tag.");

      type = true;
      colon = true;
      continue;
    } else {
      colon = false;
    }

    if(char === "|") {
      if(!type) throw new Error("Option types can only be used in the type field of the tag.");
      if(!current.options) current.options = [];
      current.options.push(current.type);
      current.type = "";
      continue;
    }

    if(type) {
      current.type += char;
    } else {
      current.name += char;
    }
  }

  // Now loop through tags again and verify the use of rest tags. mark them or error if used incorrectly.
  for(const tag of tags) {
    if(tag.type.endsWith("...")) {
      // Avoid uses like <name:string...> <another:one>
      if(tags.indexOf(tag) !== (tags.length - 1)) {
        throw new Error("Rest arguments can only be used as the last argument.");
      }

      // Otherwise mark it as a rest argument.
      tag.rest = true;
      tag.type = tag.type.slice(0, -3);
    }

    // If it's an option type mark the type.
    if(tag.options) {
      tag.options.push(tag.type);
      tag.type = "options";
    }
  }

  return tags;
}

/**
 * Formats a usage into a more user friendly form.
 * @param {String|Object} input - A usage string or an already parsed object of tags.
 * @returns {String}
 */
function format(input) {
  // honestly, idk if this is the cleanest approach but I guess it's fine for now.
  if(typeof input === "string") input = parse(input);

  return input.map((tag) => {
    return (tag.required ? "<" : "[") + (!tag.literal ? tag.name : "") +
      (tag.literal ? tag.options.join("|") : "") + (tag.rest ? "..." : "") +
      (tag.required ? ">" : "]");
  }).join(" ");
}

module.exports = { parse, format, version };
