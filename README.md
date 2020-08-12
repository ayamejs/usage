# `@ayamejs/usage`
Parses usage strings like `<target:user> [reason:string...]` into a JavaScript object like `[{ name: "target", type: "user", required: true, rest: false, options: null, literal: false }, { name: "reason", type: "string", required: false, rest: true, options: null, literal: false }]`

Used internally by the [Ayame Framework](https://github.com/ayamejs/ayame) but anyone can use it.

Join our [Discord Server](https://discord.gg/tfwTZWX) for support and more.

## Install
```sh
$ npm install @ayamejs/usage
```
If you are using Ayame then ignore this, it's already a dependency of Ayame and is used internally, this guide is for interested users who would like to use them in their own custom bots.

TypeScript typings included.

## Usage
```js
const usage = require("@ayamejs/usage");

// Parse a usage string.
usage.parse("<target:user> [reason:string...]");
// =>
// [
//   { name: 'target', type: 'user', required: true, rest: false, options: null, literal: false },
//   { name: 'reason', type: 'string', required: false, rest: true, options: null, literal: false }
// ]

// Clean the types to make it more user friendly on discord.
// Use this e.g in your help command.
usage.format("<target:user> [reason:string...]");
// => <target> [reason...]

// Or if you have a seperator.
usage.format("<username:string> <repository:string>", "/");
// => <username> / <repository>
```
Explanations on each returned property:
- **name** This is the tag name, a name is always available.
- **type** This is the type followed after the name, always available.
- **required** If true the tag was constructed with `<>` meaning it is required.
- **rest** if true the tag was constructed with `...` meaning to parse the rest of the input. Only on the last tag.
- **options** Array of options if the tag used the `|` seperator. Available on type `union` it would signify the user meant to try parsing as different types (`<target:member|user>` try parsing as member if failed try user)
- **literal** If true it means the union types are rather literal options (`<action::add|remove|list>` action can be either `add`, `remove` or `list`) This is true if the user used `::` double colons to seperate the union.

## Prefixes
Instead of repeating the same name for the type we have some aliases.

e.g instead of `<user:user>` you can use `<@user>`

**Aliases:**
- `@` user
- `@@` member
- `#` channel

The output format does not change, you can still treat it as if the full `<user:user>` was passed.

More aliases will be added if needed.

## Changelog

#### v0.2.0
- Added support for `#` prefix tags for channels.
- Add seperator option for `usage.format` to make it clear to the user about the seperator.

#### v0.1.0
- Initial release.

## License
`@ayamejs/usage` is released under the terms of [MIT LICENSE](LICENSE)
