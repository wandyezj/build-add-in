# Server

The localhost server allows the Build Add-In to request execution of commands on a local machine.

This allows the Build Add-In to extend the desktop.

The localhost server provides js wrapper functions to run server commands via a `command.js` and `command.d.ts` that can be loaded in the Build Add-Ins libraries tab.

## The Server Config

- [ ]
A server config is provided to the server.js on start. The configuration contains options of http, https, ports, modules, and security settings.

## Command Model

- [ ]
Each command is identified by a unique name. The name tells the server which command to run with what parameters.

- [ ]
Each command when run will provide a result, either a value or an error.

- [ ]
Commands should be designed to do one simple obvious thing. Multiple commands can be run in sequence with a command to run a sequence of commands.

## Command Server - Extension Model

- [ ]
The server config can specify additional modules that can be loaded to add new commands to the server. This allows new commands to be added easily. Command modules are namespaced so they don't interfere with each other.

## Command Server - Security Model

- [ ]
The server config specifies which commands can run, and any additional validations to be done on parameters.

## Command Server - Distribution

- [ ]
The Build Add-In will provide instructions and a button to download a easily readable bootstrap file which when run will: check the setup, download and verify the latest server.js, download standard command modules published on the site, and provide a standard locked down configuration that can be further modified.

## Command Server - Version

- [ ]
Versioning will use incremental whole numbers starting at 0 along with a date. The rule is to increment the number every time there is a logic change. The date should be tied to the last time it was built.

The command server itself, and individual commands may be versioned.

Generally, the goal is to keep all code updated and to allow older Build Add-In snip code to use newer versions of the server. To make that possible commands should be small and self contained and avoid breaking changes.

For simple commands backwards compatibility can be achieved by allowing a command to switch based on a requested version number, and then using that older command version - by default every command should use the latest version.

- [ ]
The server provides a command to reflexively get information about what commands and versions are available.

- [ ]
The server provides a command to check versons are available.