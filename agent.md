# Directory structures
- `AntimatterDimensionsEndgameUpdate` directory has original `Endgame Update` mod and have all commits from vanilla.
- `AD-V` directory has original `AD-Vis` mod and they don't have commits from vanilla, only source and modded commits exists.
- `NG-plus-3` directory has old mods. Most of them are using legacy codes and may not working without porting.
- These three directories should used to view original sources but never run or edit anything inside.
- `ad-minus-hell` directory is our main project, making two mods on one source.

# Savefile in shared page
- User have seperated page to testing, so shared page can be modified or perform reset or anything without any risk.
- We have shared savefile, `temporary-shared-save.txt` right under main project dir.
- You can load savefile from import their content or file itself.

# Changing tabs on shared view
- Sometimes, you can't click subtab button directly
- You can go tab by find maintab from `window.Tabs.all:TabState[]` and `TabState.subtabs:SubtabState[]`, then call `SubtabState.show(manual: boolean):void`
- Due to current setting, you must set `manual: boolean` to `true` to change tab.

# Number vs Decimal
On most cases, you must use Decimal on conflicts or overflow.
Number can only store around `e308`, while Decimal can store `ee...ee308` with `e308` of `e`s.
But their mathmatical operators aren't compartible. So, you must edit all usage of that variable before applying change.

# Testing server
- Don't change port. Only use 8080.
- It keeps running until manually stopped. So, **don't wait until server is stopped** and just keep it background.