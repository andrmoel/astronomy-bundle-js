# Instructions for AI agents

* Ignore the `/old` folder
* Order functions within a file hierarchically, like a book's table of contents: public entry points first, then the helpers they call, drilling down so a caller always appears before its callees. Do not prefix function names with underscores.
* Avoid extensive comments. The code should be self-explanatory.

## General instructions

* Add unit tests for all added or changed logic
* Run `yarn lint:fix` and `yarn check:typescript` after every task. Ensure everything is working.
* All types belong into a dedicated file in the `types` folder.
* Order functions hierarchically like a TOC of a book.
