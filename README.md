# Mayriad's EH Master Script

[![GitHub Release](https://img.shields.io/github/release/Mayriad/Mayriads-EH-Master-Script)]() [![Github Release Date](https://img.shields.io/github/release-date/Mayriad/Mayriads-EH-Master-Script)]() [![Github License](https://img.shields.io/github/license/Mayriad/Mayriads-EH-Master-Script)]() [![Code Style](https://img.shields.io/badge/code_style-standard-brightgreen)]()

`TODO: Github Release Version` `TODO: Github Release Date` `TODO: license` `TODO: standardjs`

[Userscript Download]() • [Userscript Wiki]() • [Discussion Thread]()

Adds 24+ features to E-Hentai.

## Table of contents

- [Disclaimer](#disclaimer)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Disclaimer

1) This is the public version of a private script I wrote for myself over the years. It has been very slightly nerfed compared to the private version. I decided to put in 4 months of extra efforts to upgrade this script and make it available to everyone because it is too great to keep to myself. However, this is still my personal private project and I may not be super cooperative about it.

2) Since this is just a private script I wrote for myself, it naturally does not collect any information from the user and does not do any fishy stuff. The code is self-contained, fully transparent, very readable and well documented, so you are welcome to inspect the code if you want.

3) I am purely self-taught, so I am not a real programmer at all and I may have limited ability to debug telepathically, fulfil feature requests or make changes even if they make sense. However, I am quite confident in the quality and readability of this script, since I did spend several years and hundreds of hours on it. I do not think this script needs a lot of active development besides necessary fixes, since it already has a ton of features, and real life constraints are making it more difficult for me to work on it.

4) Although I have been using it for years, this script is way too big (25+ features and 4600+ lines of code) for me to test thoroughly all usage scenarios on all platforms, browsers, userscript engines and EH pages for this public release. This is made slightly worse by the fact that I have rewritten this script over the last 4 months and also added new features. Furthermore, there are errors that the script cannot handle, because I cannot trigger and test them in the first place. Therefore, there might be bugs and you should submit a report to me if you ever encounter one.

5) To keep this readme easy to read, a lot of information is placed in [the wiki for this master script](https://github.com/Mayriad/Mayriads-EH-Master-Script/wiki) instead. I will add more content to this wiki over time if I have stuff to talk about.

[⇧ Back to table of contents](#table-of-contents)

## Features

This is just short list to show its features. A longer list with explanations is provided [in the wiki](). You can selectively enable any of the features below, except for the GUI control panel, which is always on.

**Site-wide features:**

- Scientific dark theme
- Scientific light theme
- Design fixes
- Subjective fixes
- Improved navigation bar
- Comment and forum filters
- Jump to top/bottom buttons
- Dawn reward extension


**Gallery list features:**

- Additional gallery filters
- Unselect category buttons
- Full titles above thumbnails
- Gallery colour coding
- Gallery download shortcuts
- Open galleries in tabs

**Gallery view features:**

- Vigilante thread links
- Alternative rating system
- Clickable external URLs

**Image view features:**

- Basic viewer fit-to-screen
- MPV fit-to-screen
- Hide MPV toolbar
- Remove MPV tooltips
- Relocate MPV thumbnails

**Upload management features:**

- Upload guide links

**Script features:**

- GUI control panel

[⇧ Back to table of contents](#table-of-contents)

## Installation

Firstly, regarding compatibility:

- Greasemonkey is not supported because it is weird these days and breaks some of the features for unknown reasons.
- The gallery download shortcuts feature basically requires Tampermonkey, because it is the only userscript engine that nicely supports `GM.download()`.
- Tampermonkey on a Chromium browser is the recommended combo, which means browsers like Chrome and Vivaldi are good. Firefox also works. Other browsers have not been tested.

When your browser and userscript engine are ready, head to [this userscript's page on OpenUserJS]() and install it. Please install it from OpenUserJS so that I can keep track of the downloads. You should be able to update this script directly from your userscript engine, although sometimes the engine can fail to detect updates from experience.

If you are going to use the download shortcuts feature, you may have to complete one or two additional simple steps to grant this script the permission it needs to download archives and/or torrents from EH. These steps are explained [in the dedicated wiki page for this feature]().

[⇧ Back to table of contents](#table-of-contents)

## Usage

When you first activate this script, you should notice that there is a button that says "Configure Mayriad's Script" on all gallery lists. Clicking this button will open the GUI control panel and you can then enable the features and options you plan to use. You can read a bit more about the features [in the wiki](). Some recommend features and options are enabled by default, so you can see their effects immediately after this script is activated.

This control panel is built into all types of gallery lists on EH, and this should be the only thing you need to control this script. Your settings should persist between updates, so you should not need to touch the code at all. The control panel has explanations for all features and options, and notifications will tell you what to do, so in general this script should be very straightforward to use. You may want to read a bit more about the relatively complicated download shortcuts feature [in the wiki](###todo), though.

After you have changed the settings, remember to click the save button in the top left corner and refresh the page like the notification will say. Then you can start enjoying a better EH with my script.

[⇧ Back to table of contents](#table-of-contents)

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

[⇧ Back to table of contents](#table-of-contents)
