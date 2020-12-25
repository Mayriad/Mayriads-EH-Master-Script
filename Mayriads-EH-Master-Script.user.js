// ==UserScript==
// @name            Mayriad's EH Master Script
// @namespace       https://github.com/Mayriad
// @version         2.1.3
// @author          Mayriad
// @description     Adds dozens of features to E-Hentai
// @icon            https://e-hentai.org/favicon.ico
// @updateURL       https://openuserjs.org/meta/Mayriad/Mayriads_EH_Master_Script.meta.js
// @downloadURL     https://openuserjs.org/install/Mayriad/Mayriads_EH_Master_Script.user.js
// @supportURL      https://github.com/Mayriad/Mayriads-EH-Master-Script
// @match           https://e-hentai.org/*
// @match           https://exhentai.org/*
// @match           https://repo.e-hentai.org/*
// @match           https://upload.e-hentai.org/*
// @match           https://forums.e-hentai.org/*
// @match           https://hentaiverse.org/*
// @connect         self
// @connect         e-hentai.org
// @connect         ehtracker.org
// @connect         hentaiverse.org
// @connect         *
// @run-at          document-start
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.xmlHttpRequest
// @grant           GM.download
// @grant           GM.info
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @copyright       2015-2020, Mayriad (https://github.com/Mayriad)
// @license         GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// ==/UserScript==

/**
 * @author Mayriad
 * @copyright 2015-2020 Mayriad
 * @license GNU General Public License v3.0 or later
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program. If not, see
 * <https://www.gnu.org/licenses/>.
 */

// Userscript download: https://openuserjs.org/scripts/Mayriad/Mayriads_EH_Master_Script
// GitHub repository: https://github.com/Mayriad/Mayriads-EH-Master-Script
// User manual: https://github.com/Mayriad/Mayriads-EH-Master-Script/blob/master/README.md
// Support thread: https://forums.e-hentai.org/index.php?showtopic=233955

/* global GM, alert, XPathResult, MutationObserver, DOMParser, Blob */

;(function () {
  'use strict'
  // JSDoc definitions -------------------------------------------------------------------------------------------------

  /**
   * A callback function that handles a click mouse event.
   *
   * @callback clickEventHandler
   * @param {MouseEvent} [clickEvent] - The event object passed to this event handler on click.
   */

  // Initialisation ----------------------------------------------------------------------------------------------------

  // Violentmonkey now also supports GM.* aliases that are compatible with GM API v4, but GM.download() is still not
  // supported. Therefore, GM.download() can be used to check the userscript engine.
  const api = {
    setValue: GM.setValue,
    getValue: GM.getValue,
    xmlHttpRequest: GM.xmlHttpRequest,
    info: GM.info
  }
  if (typeof GM.download !== 'undefined') {
    // Tampermonkey
    api.download = GM.download
    api.version = 'v4'
  } else {
    // Violentmonkey
    api.version = 'v3'
  }

  // Initialise the settings using the default values below before reading actual settings from the userscript storage.
  let settings = {
    applyDarkTheme: {
      featureEnabled: false
    },
    applyLightTheme: {
      featureEnabled: false
    },
    relocateMpvThumbnails: {
      featureEnabled: true
    },
    hideMpvToolbar: {
      featureEnabled: true
    },
    applyAdditionalFilters: {
      featureEnabled: false,
      ratedFilterEnabled: false,
      ratedFilterStars: '',
      ratedFilterExceptionEnabled: false,
      ratedFilterExceptions: 'the favorite list and the popular list',
      favoritedFilterEnabled: false,
      favoritedFilterCategories: '',
      favoritedFilterExceptionEnabled: false,
      titleFilterEnabled: false,
      titleFilterType: 'one of the keywords',
      titleFilterKeywords: '',
      titleFilterExceptionEnabled: false,
      titleFilterExceptions: 'the favorite list and the popular list'
    },
    applyTextFilters: {
      featureEnabled: false,
      commentatorFilterEnabled: false,
      commentatorFilterUsernames: '',
      commentFilterEnabled: false,
      commentFilterKeywords: '',
      posterFilterEnabled: false,
      posterFilterType: 'forum posts',
      posterFilterUsernames: '',
      postFilterEnabled: false,
      postFilterType: 'forum posts',
      postFilterKeywords: '',
      spamFilterEnabled: false
    },
    applyDesignFixes: {
      featureEnabled: true
    },
    improveNavigationBar: {
      featureEnabled: true,
      unreadCountsEnabled: true
    },
    addVigilanteLinks: {
      featureEnabled: true
    },
    showAlternativeRating: {
      featureEnabled: true,
      hideStarsEnabled: false
    },
    addGuideLinks: {
      featureEnabled: true
    },
    applySubjectiveFixes: {
      featureEnabled: true
    },
    emptyCategoryFilter: {
      featureEnabled: false
    },
    fitThumbnailTitles: {
      featureEnabled: true
    },
    colourCodeGalleries: {
      featureEnabled: true
    },
    fitViewerToScreen: {
      featureEnabled: true
    },
    fitMpvToScreen: {
      featureEnabled: true,
      makeDefaultEnabled: true,
      mpsModeEnabled: false,
      seamlessModeEnabled: false
    },
    useAutomatedDownloads: {
      featureEnabled: false,
      torrentDownloadEnabled: true,
      torrentRequirementsEnabled: true,
      minimumSeedNumber: 3,
      ignoreRequirementsSize: 2048,
      personalisedTorrentEnabled: true,
      apiTorrentDownloadEnabled: true,
      archiveDownloadEnabled: true,
      archiveDownloadType: 'original archive',
      appendIdentifiersEnabled: false,
      pageDownloadEnabled: true,
      pageDownloadNumber: 3,
      pageRangeDownloadEnabled: true,
      downloadProtectionEnabled: true,
      hideThumbnailEnabled: true,
      downloadAlertsEnabled: true
    },
    openGalleriesSeparately: {
      featureEnabled: true,
      directMpvEnabled: false
    },
    addJumpButtons: {
      featureEnabled: true,
      jumpButtonStyle: 'slide-in rectangular buttons',
      jumpBehaviourStyle: 'smoothly'
    },
    parseExternalLinks: {
      featureEnabled: true
    },
    removeMpvTooltips: {
      featureEnabled: false
    },
    collectDawnReward: {
      featureEnabled: true
    },
    script: {
      version: api.info.script.version,
      filterButtonEnabled: false,
      firefoxCompatibilityEnabled: false,
      buttonTooltipEnabled: true
    }
  }

  // These persistent variables are stored and used separately from the settings, and the values below are their default
  // values.
  let values = {
    improveNavigationBar: {
      lastKarmaRead: ''
    },
    useAutomatedDownloads: {
      pagesToDownload: {}
    },
    collectDawnReward: {
      lastCollectedReward: 0
    },
    script: {
      version: api.info.script.version
    }
  }

  // These are the possible values for the setting keys that accept pre-defined options, and hence also for the
  // corresponding option selectors in the control panel.
  const options = {
    applyAdditionalFilters: {
      ratedFilterExceptions: ['the favorite list', 'the popular list', 'the favorite list and the popular list'],
      titleFilterType: ['one of the keywords', 'one match with the regular expression'],
      titleFilterExceptions: ['the favorite list', 'the popular list', 'the favorite list and the popular list']
    },
    applyTextFilters: {
      posterFilterType: ['forum posts', 'forum threads', 'forum posts and threads'],
      postFilterType: ['forum posts', 'forum threads', 'forum posts and threads']
    },
    useAutomatedDownloads: {
      archiveDownloadType: ['original archive', 'resample archive', 'H@H 780x', 'H@H 980x', 'H@H 1280x',
        'H@H 1600x', 'H@H 2400x', 'H@H original']
    },
    addJumpButtons: {
      jumpButtonStyle: ['fade-in circular buttons', 'slide-in rectangular buttons'],
      jumpBehaviourStyle: ['smoothly', 'instantly']
    }
  }

  // These are the notification messages that will be shown to the user when needed.
  const messages = {
    applyAdditionalFilters: {
      ratedFilterStars: {
        emptyInputError: 'Since the rated gallery filter has been enabled, please enter the numbers of stars to ' +
          'hide the galleries to which you have given these stars.',
        invalidInputError: 'Invalid input detected. Please enter the numbers of stars in a proper format to hide ' +
          'the galleries to which you have given these stars. Please note that the possible numbers are 0.5, 1.0, ' +
          '1.5, 2.0 ... 4.5, 5.0. You can omit the leading zero in a decimal and the decimal part in an integer, ' +
          'but you must separate the numbers by comma.'
      },
      favoritedFilterCategories: {
        emptyInputError: 'Since the favorited gallery filter has been enabled, please enter the favorite ' +
          'categories to hide the galleries you have added to these categories.',
        invalidInputError: 'Invalid input detected. Please enter the favorite categories in a proper format to ' +
          'hide the galleries you have added to these categories. Please note that the names of these categories ' +
          'must agree with the actual categories you are using.'
      },
      titleFilterKeywords: {
        emptyInputError: 'Since the gallery title filter has been enabled, please enter the title keywords to ' +
          'hide the galleries that have at least one of these keywords in their displayed titles shown in gallery ' +
          'lists.',
        invalidInputError: 'Since the gallery title filter has been enabled, please enter the regular expression ' +
          'to hide the galleries whose title has at least one match with this regular expression.'
      }
    },
    applyTextFilters: {
      commentatorFilterUsernames: {
        emptyInputError: 'Since the gallery commentator filter has been enabled, please enter the usernames of the ' +
          'commentators to hide all comments they made.'
      },
      commentFilterKeywords: {
        emptyInputError: 'Since the gallery comment filter has been enabled, please enter the keywords to hide the ' +
          'comments that contain any of these keywords.'
      },
      posterFilterUsernames: {
        emptyInputError: 'Since the forum poster filter has been enabled, please enter the usernames of the ' +
          'posters to hide all posts they made.'
      },
      postFilterKeywords: {
        emptyInputError: 'Since the gallery comment filter has been enabled, please enter the keywords to hide the ' +
          'posts that contain any of these keywords.'
      }
    },
    useAutomatedDownloads: {
      minimumSeedNumber: {
        emptyInputError: 'Since torrent download has been enabled, please enter the minimum number of seeds that ' +
          'will be required before a torrent can be considered healthy and viable. Entering 0 would remove this ' +
          'minimum seed number requirement.',
        invalidInputError: 'Invalid input detected. Please note that the setting for the minimum number of seeds ' +
          'required only accepts a number between 1 and 9, inclusive.'
      },
      ignoreRequirementsSize: {
        emptyInputError: 'Since torrent download has been enabled, please enter the gallery size above which the ' +
          'torrent requirements do not apply. This should be the largest gallery size that you are willing to ' +
          'download as an archive when there is also a torrent available as a fallback option.',
        invalidInputError: 'Invalid input detected. Please note that the gallery size above which the torrent ' +
          'requirements do not apply only accepts a number between 0 and 9999, inclusive. This should be the largest ' +
          'gallery size that you are willing to download as an archive when there is also a torrent available as a ' +
          'fallback option.'
      },
      pageDownloadNumber: {
        emptyInputError: 'Since the page download button has been enabled, please enter the number of concurrent ' +
          'gallery downloads per tab to be allowed in this mode. A high number might cause temporary bans.',
        invalidInputError: 'Invalid input detected. Please note that the number of concurrent gallery downloads per ' +
          'tab requires a number between 1 and 9, inclusive. A high number might cause temporary bans.'
      },
      runtime: {
        // Unavailable download errors:
        networkError: 'A download failed due to a network connection error. Please try again after your network ' +
          'recovers',
        serviceUnavailableError: 'A download failed, because the server was unavailable and the website failed to ' +
          'respond. The repair ponies are on the case, so please wait for a few minutes and try again.',
        backendFetchError: 'A download failed, because the server was unavailable and the website failed to ' +
          'respond. Please wait for a few hours and try again.',
        unavailableArchiverError: 'An archive download failed, because the archiver for this gallery is unavailable ' +
          'at the moment. Please wait for a few hours and try again.',
        unavailableTorrentError: 'A torrent download failed, because the torrent is not available at the moment. ' +
          'Please try again after a few minutes or manually download the personalised torrent instead.',
        // Failed download errors:
        unavailableGalleryError: 'A download failed, because the gallery is removed or not available.',
        downloadedBytesError: 'An archive download failed, because you have clocked too many downloaded bytes on ' +
          'this archive link and it is no longer usable. You can wait for it to expire after a few days and then buy ' +
          'the archive again, or manually cancel the current link in the archive selection popup and buy the archive ' +
          'again immediately.',
        expiredSessionError: 'An archive download failed, because you purchased this archive a week ago and the ' +
          'expiry of that session stopped the current download. Please try again after one day.',
        illegalFilenameError: 'A download failed, because the name of the file being downloaded contains ' +
          'one or more illegal characters not accepted by GM.download(). Please manually download this gallery.',
        // Temporary ban errors:
        heavyLoadError: 'A download is stopped, because you have been warned by the site for loading too many pages ' +
          'and/or images too quickly. Please slow down and wait for a while before continuing with the download.',
        temporaryBanError: 'A download failed, because you have been temporarily banned from EH for loading too many' +
          'pages and/or images too quickly. Please wait until the ban is lifted.',
        // Setup errors:
        notLoggedInError: 'An archive/H@H download failed, because you are not logged in. Please log in first ' +
          'before attempting an automated archive/H@H download.',
        autoSelectHathError: 'A H@H download failed, because you have selected to use the H@H downloader, but you ' +
          'are using an archiver setting that auto-selects the doggie bag archive to download in your EH gallery ' +
          'settings. Please note that you can only use the master script to download via the H@H downloader if your ' +
          'archiver settings is on "manual select"',
        unqualifiedHathError: 'A H@H download failed, because you have selected to use the H@H downloader, but you ' +
          'do not qualify for this downloader. Please note that you will only be entitled to use this downloader if ' +
          'you are running a H@H client.',
        gmDownloadFileExtensionError: 'An file download failed, because the extension of this file is not in the ' +
          'whitelist for GM.download() in Tampermonkey advanced settings. This means you have either not added ' +
          '.torrent to this list or removed .zip from it. Please ensure both extensions are whitelisted in the ' +
          '"downloads beta" section in Tampermonkey advanced settings.',
        gmDownloadNotEnabledError: 'An archive download failed, because the GM.download() function is not enabled ' +
          'or does not have permission. Please check the "downloads beta" section in your Tampermonkey settings.',
        gmDownloadNotSupportedError: 'An archive download failed, because the GM.download() function is not ' +
          'supported by your userscript engine. Please note that the archive download feature requires Tampermonkey ' +
          'running on modern browsers.',
        crossOriginNotAllowedError: 'An archive download failed, because this script is not allowed to access ' +
          'cross-origin archive servers. Archives are served from random cross-origin servers, so this script needs ' +
          'to be granted access to all domains at all times in Tampermonkay.',
        unknownError: 'The download cannot be initiated for some unknown reason.'
      }
    }
  }

  // These are common variables used in feature functions.
  const windowUrl = window.location.href
  // Most page types can be determined from URL but not all, and the display mode can only be determined from the
  // "interactive" ready state onwards in all gallery lists except for gallery toplists, so these variables will not be
  // used in functions that run at the "loading" ready state.
  let pageType
  let displayMode

  /**
   * Reads settings and values from storage and runs the script.
   */
  ;(async function () {
    /**
     * Loads saved data from the userscript storage and decides whether default, saved, or updated data should be used.
     *
     * @param {string} savedDataName - The name to be used by GM.getValue() to retrive the saved data from storage.
     * @param {Object} defaultData - A hard-coded object literal with default values from the start of the script.
     * @returns {Object} An object literal that could be the saved data, updated saved data, or default data.
     */
    const loadData = async function (savedDataName, defaultData) {
      let savedData = await api.getValue(savedDataName)
      if (typeof savedData === 'undefined') {
        // Use the default data when nothing has been saved.
        return defaultData
      }

      savedData = JSON.parse(savedData)
      if (savedData.script.version === defaultData.script.version) {
        // Use the saved data directly when the version and hence the script have not changed.
        return savedData
      } else {
        // Update the keys of the saved data after a script update and use the updated data.
        const updatedData = updateKeys(renameKeys(savedData, 2), defaultData, 2)
        // Update the userscript storage as well so that the data do not need to be updated everytime this script runs.
        updatedData.script.version = defaultData.script.version
        api.setValue(savedDataName, JSON.stringify(updatedData))
        return updatedData
      }
    }

    /**
     * Renames keys of an object literal while keeping their values by creating new properties and removing old ones.
     *
     * It is easier to do this task in a separate function that runs before updateData(). This function always runs in
     * loadData() but does nothing when the rename list is empty.
     *
     * @param {Object} data - An object literal whose keys will be renamed when needed.
     * @param {number} levelsToCheck - An integer n, which means the function will check up to keys on the nth level.
     * @returns {Object} An object literal whose keys have been renamed where necessary.
     */
    const renameKeys = function (data, levelsToCheck) {
      // This object should contain "old name": "new name" pairs.
      const renames = {
        useDownloadShortcuts: 'useAutomatedDownloads'
      }
      // Make no change and directly return the same object when nothing needs to be renamed.
      if (Object.keys(renames).length === 0) {
        return data
      }

      for (const oldName of Object.keys(renames)) {
        for (const key of Object.keys(data)) {
          // Try to find and rename the target property on one level in one branch, and use recursion where applicable.
          // The search is rather thorough because it assumes the same property can exist on multiple levels in multiple
          // branches.
          if (key === oldName) {
            const newName = renames[oldName]
            data[newName] = data[oldName]
            delete data[oldName]
            if (levelsToCheck > 1) {
              data[newName] = renameKeys(data[newName], levelsToCheck - 1)
            }
            // Break the loop since the same key cannot exist twice on one level in one branch.
            break
          } else if (levelsToCheck > 1) {
            data[key] = renameKeys(data[key], levelsToCheck - 1)
          }
        }
      }
      return data
    }

    /**
     * Checks a previously saved data object against a default one recursively to update its keys after a script update.
     *
     * @param {Object} savedData - A previously saved object literal read from the userscript storage.
     * @param {Object} defaultData - A hard-coded object literal with default values from the start of the script.
     * @param {number} levelsToCheck - An integer n, which means the function will check up to keys on the nth level.
     * @returns {Object} An object literal whose keys and values are adjusted to match the defaults where necessary.
     */
    const updateKeys = function (savedData, defaultData, levelsToCheck) {
      const keyUnion = [...new Set([...Object.keys(savedData), ...Object.keys(defaultData)])]
      for (const key of keyUnion) {
        if (typeof savedData[key] === 'undefined') {
          // Check for newly added keys that only exist in the default data. The default values will be added to the
          // saved data.
          savedData[key] = defaultData[key]
        } else if (typeof defaultData[key] === 'undefined') {
          // Check for removed keys that no longer exist in the default data. These keys will be removed from the saved
          // data.
          delete savedData[key]
        } else {
          if (levelsToCheck > 1) {
            // Check the keys under this key when this key is consistent between the two data objects.
            savedData[key] = updateKeys(savedData[key], defaultData[key], levelsToCheck - 1)
          }
        }
      }
      return savedData
    }

    // Load settings and values from storage before running feature functions.
    settings = await loadData('settings', settings)
    values = await loadData('values', values)
    // Run feature functions at two different ready states.
    runFeaturesAtLoading()
    scheduleForInteractive(runFeaturesAtInteractive)
  })()

  // Feature functions -------------------------------------------------------------------------------------------------

  /**
   * Runs feature functions at the "loading" ready state, which belong to feature function group 1.
   */
  const runFeaturesAtLoading = function () {
    // Function that are supposed to run at this ready state can often fail to run on Firefox. If the Firefox
    // compatibility mode is enabled, then they will be loaded at the "interactive" ready state to ensure they will
    // always be able to run, at the cost of causing noticeable visual changes when they are loaded.
    if (!settings.script.firefoxCompatibilityEnabled) {
      // Group 1: functions that can run before DOM elements are loaded.
      settings.applyDarkTheme.featureEnabled && applyDarkTheme()
      settings.applyLightTheme.featureEnabled && applyLightTheme()
      settings.relocateMpvThumbnails.featureEnabled && relocateMpvThumbnails()
      settings.hideMpvToolbar.featureEnabled && hideMpvToolbar()
    }
  }

  /**
   * Applies a full, scientific dark theme to the entire gallery system on the applicable domain.
   *
   * This theme is mainly scientifically produced by summarising colour differences between style sheets. Custom styles
   * are added to cover unique pages, inline styles and style tags from document.head.
   */
  const applyDarkTheme = function () {
    // This feature is only applicable to EH, and it covers the entire EH.
    if (!windowUrl.includes('e-hentai.org') || windowUrl.includes('forums.e-hentai.org')) {
      return
    }

    // These are the colour differences programmatically extracted from two 0347 style sheets. They do not cover
    // everything because there are unique pages, inline styles and style tags.
    let scientificDarkStyles = `
      body { color: #f1f1f1; background: #34353b }
      a { color: #DDDDDD }
      a:hover { color: #EEEEEE }
      /* input */
      input, select, option, optgroup, textarea { color: #f1f1f1; background-color: #34353b }
      input[type = "button"], input[type = "submit"] { border: 2px solid #8d8d8d }
      input[type = "button"]:enabled:hover, input[type = "submit"]:enabled:hover, input[type = "button"]:enabled:focus,
        input[type = "submit"]:enabled:focus { background-color: #43464e !important; border-color: #aeaeae !important }
      input[type = "button"]:enabled:active, input[type = "submit"]:enabled:active
        { background: radial-gradient(#1a1a1a, #43464e) !important; border-color: #c3c3c3 !important }
      input[type = "text"], input[type = "password"], select, textarea { border: 1px solid #8d8d8d }
      input:disabled, select:disabled, textarea:disabled { color: #f1f1f1; -webkit-text-fill-color: #f1f1f1 }
      input::placeholder, textarea::placeholder { color: #f1f1f1; -webkit-text-fill-color: #f1f1f1 }
      input[type = "text"]:enabled:hover, input[type = "password"]:enabled:hover, select:enabled:hover,
        textarea:enabled:hover, input[type = "text"]:enabled:focus, input[type = "password"]:enabled:focus,
        select:enabled:focus, textarea:enabled:focus { background-color: #43464e }
      input[type = "file"] { border: 2px solid #8d8d8d }
      .lc:hover input:enabled ~ span, .lr:hover input:enabled ~ span, .lc input:enabled:focus ~ span,
        .lr input:enabled:focus ~ span { background-color: #43464e !important; border-color: #aeaeae !important }
      .lc input:disabled ~ span, .lr input:disabled ~ span { border-color: #5c5c5c !important }
      .lc > span { background-color: #34353b; border: 2px solid #8d8d8d }
      .lc > span:after { border: solid #f1f1f1 }
      .lr > span { background-color: #34353b; border: 2px solid #8d8d8d }
      .lr > span:after { background: #f1f1f1 }
      /* misc */
      .br { color: #FF3333 }
      .stuffbox { background: #4f535b; border: 1px solid #000000 }
      /* rating */
      img.th { border: 1px solid #000000 }
      div.ido { background: #4f535b; border: 1px solid #000000 }
      /* shared table stuff */
      div.itg { border-top: 2px ridge #3c3c3c; border-bottom: 2px ridge #3c3c3c }
      table.itg { border: 2px ridge #3c3c3c }
      table.itg > tbody > tr > th { background: #40454b }
      table.itg > tbody > tr:nth-child(2n + 1), table.itg > tbody > tr:nth-child(2n + 1) .glthumb,
        table.itg > tbody > tr:nth-child(2n + 1) .glcut { background: #363940 }
      table.itg > tbody > tr:nth-child(2n + 2), table.itg > tbody > tr:nth-child(2n + 2) .glthumb,
        table.itg > tbody > tr:nth-child(2n + 2) .glcut { background: #3c414b }
      table.mt { border: 1px solid #000000; background: #40454b }
      table.mt > tbody > tr:nth-child(2n + 1) { background: #363940 }
      table.mt > tbody > tr:nth-child(2n + 2) { background: #3c414b }
      tr.gtr, table.mt > tbody > tr:first-child { background: #40454b !important }
      td.itd { border-right: 1px solid #6f6f6f4d }
      /* login boxes */
      div.d { border: 1px solid #000000; background: #4f535b }
      div.ds { border: 1px solid #000000; background: #4f535b }
      /* index */
      div.idi { border: 2px ridge #3c3c3c }
      div#iw { color: #FF3333 }
      /* gallery list */
      a:visited .glink, a:active .glink { color: #BBBBBB }
      a:hover .glink { color: #EEEEEE }
      .glname a :not(.glink), a .glname :not(.glink) { color: #dddddd }
      .glcat { border-right: 1px solid #6f6f6f4d }
      .glthumb { border: 2px solid #6f6f6f4d }
      .glthumb > div:nth-child(1) { border: 1px solid #000000 }
      .gltc > tbody > tr > td, .glte > tbody > tr > td { border-right: 1px solid #6f6f6f4d }
      .gltm > tbody > tr > td { border-right: 1px solid #6f6f6f4d }
      .gl1c, .gl2c, .gl3c, .gl4c, .glfc { border-top: 1px solid #6f6f6f4d; border-bottom: 1px solid #6f6f6f4d }
      .gl1e, .gl2e, .glfe { border-top: 1px solid #6f6f6f4d; border-bottom: 1px solid #6f6f6f4d }
      .gl1e > div { border: 1px solid #000000 }
      .gl4e { border-left: 1px solid #6f6f6f4d }
      .gld { border-left: 1px solid #6f6f6f4d }
      .gl1t { border-right: 1px solid #6f6f6f4d; border-bottom: 1px solid #6f6f6f4d }
      .gl3t { border: 1px solid #000000 }
      .gl1t:nth-child(2n + 1) { background: #363940 }
      .gl1t:nth-child(2n + 2) { background: #3c414b }
      /* category buttons */
      .ct1 { background: #777777; border-color: #777777 } /* misc */
      .ct2 { background: #9E2720; border-color: #9E2720 } /* doujinshi */
      .ct3 { background: #DB6C24; border-color: #DB6C24 } /* manga */
      .ct4 { background: #D38F1D; border-color: #D38F1D } /* artistcg */
      .ct5 { background: #6A936D; border-color: #617C63 } /* gamecg */
      .ct6 { background: #325CA2; border-color: #325CA2 } /* imageset*/
      .ct7 { background: #6A32A2; border-color: #6A32A2 } /* cosplay */
      .ct8 { background: #A23282; border-color: #A23282 } /* asianporn */
      .ct9 { background: #5FA9CF; border-color: #5FA9CF } /* nonh */
      .cta { background: #AB9F60; border-color: #AB9F60 } /* western */
      /* page selector */
      table.ptt { color: #f1f1f1 }
      table.ptt td { background: #34353b; border: 1px solid #000000 }
      table.ptt td:hover { color: #000000; background: #43464e }
      table.ptb { color: #f1f1f1 }
      table.ptb td { background: #34353b; border: 1px solid #000000 }
      table.ptb td:hover { color: #000000; background: #43464e }
      td.ptds { color: #000000 !important; background: #43464e !important }
      td.ptdd:hover { color: #C2A8A4 !important; background: #34353b !important }
      /* gallery */
      a.tup { color: #00E639 }
      a.tdn { color: #FF3333 }
      span.tup { color: #00E639 }
      span.tdn { color: #FF3333 }
      div.gm { background: #4f535b; border: 1px solid #000000 }
      div#gmid { background: #4f535b }
      div#gright { background: #4f535b }
      div#gd1 div { border: 1px solid #000000 }
      div#gd2 { background: #4f535b }
      h1#gj { color: #b8b8b8; border-bottom: 1px solid #000000 }
      div#gd4 { border-left: 1px solid #000000; border-right: 1px solid #000000 }
      div#gdt { background: #4f535b; border: 1px solid #000000 }
      div#gdt img { border: 1px solid #000000 }
      div.gt { border: 1px solid #989898; background: #4f535b }
      div.gtl { border: 1px dashed #8c8c8c; background: #4f535b }
      div.gtw { border: 1px dotted #8c8c8c; background: #4f535b }
      #gds { background: #4f535b }
      #grl { color: #FF3333 }
      div.c2 { background: #34353b; border: 1px solid #4f535b }
      div.ths { border: 1px solid #989898; background: #4f535b }
      div.tha { border: 1px solid #706563 }
      div.tha:hover { background: #4f535b; color: #000000 }
      div.thd { border: 1px solid #706563; color: #706563 }
      /* image pages */
      div.sni { background: #4f535b; border: 1px solid #000000 }`

    // These are extracted from the style tags in document.head.
    scientificDarkStyles += `
      /* keep the ticks in checkboxes */
      .lc > span:after { border-width: 0 3px 3px 0 !important; }
      /* page-specific */`
    if (/e-hentai\.org\/g\/\d+\/[0-9a-z]+\/\?act=expunge/.test(windowUrl)) {
      scientificDarkStyles += `
        #gdt.exp_outer { border-color: #000000; }
        .exp_entry { border-color: #8d8d8d; }
        .exp_table { border-color: #34353b; }`
    } else if (/e-hentai\.org\/mpv\//.test(windowUrl)) {
      scientificDarkStyles += `
        div.mi0 { background: #43464e; border: 1px solid #34353b; }`
    } else if (windowUrl.includes('favorites.php')) {
      scientificDarkStyles += `
        div.fp:hover { background:#43464e; }
        div.fps { background:#43464e; }
        @supports (display:grid) {
          @media screen and (max-width:1080px) {
            .gl1t:nth-child(8n + 1), .gl1t:nth-child(8n + 3), .gl1t:nth-child(8n + 6), .gl1t:nth-child(8n + 8)
              { background: #363940; }
            .gl1t:nth-child(8n + 2), .gl1t:nth-child(8n + 4), .gl1t:nth-child(8n + 5), .gl1t:nth-child(8n + 7)
              { background: #3c414b; }
          }
        }`
    } else if (windowUrl.includes('mytags')) {
      scientificDarkStyles += `
        #usertags_mass > div { border-top: 1px solid #34353b; }
        .jscolor { border: 1px solid #8d8d8d; }
        .tagcomplete-items { border: 1px solid #8d8d8d; }
        .tagcomplete-items div { background-color: #4f535b; }
        .tagcomplete-items div:not(:last-child) { border-bottom: 1px solid #5e5e5e; }
        .tagcomplete-items div:last-child { border-bottom: 1px solid #8d8d8d; }
        .tagcomplete-items div:hover { background-color: #43464e; }
        .tagcomplete-active { background-color: #f1f1f1 !important; color: #4f535b }`
    } else if (windowUrl.includes('managegallery')) {
      scientificDarkStyles += `
        td.l { border-bottom: 1px solid #f1f1f1; border-right: 1px dashed #f1f1f1; }
        td.r { border-bottom: 1px solid #f1f1f1; }
        td#d { border-right: 1px dashed #f1f1f1; }
        div[id ^= "cell_"] { background: #5f636b; border: 1px solid #34353b; }`
      // The upload list also has styles in document.head, but they are the same on both sides. There are only two
      // effective colour properties, but they only fit the light theme, so a fix is added to applyDesignFixes() for the
      // dark theme.
    } else if (windowUrl.includes('bounty.php?bid=')) {
      scientificDarkStyles += `
        span.scr { color: red; }
        span.scb { color: blue; }
        span.scg { color: green; }
        span.sco { color: #FF8C00; }
        div#x { border-color: #34353b; background: #43464e; }
        div#g th { border-bottom-color: #000000; }
        div#h th { border-bottom-color: #000000; }`
    } else if (windowUrl.includes('bounty.php?act=top')) {
      scientificDarkStyles += `
        span.scr { color: red; }
        span.scb { color: blue; }
        span.scg { color: green; }
        span.sco { color: #FF8C00; }
        div#t img { border-color: black; }
        div#f span { color: #f1f1f1; }
        div.d4 { border-color: #000000; }
        div.d5 { border-color: #000000; }`
    } else if (windowUrl.includes('gallerytorrents.php')) {
      scientificDarkStyles += `
        table#ett { background: #43464e; border: 1px solid #34353b; }
        div#etd { background: #43464e; border: 1px solid #34353b; }`
    } else if (windowUrl.includes('archiver.php')) {
      scientificDarkStyles += `
        div#db { border: 1px solid #000000; background: #4f535b; }`
    }

    // These styles cover the styles not included in the default dark styles in style sheet and style tags, so they
    // cannot be scientifically produced. Some of them also override the scientific styles.
    let customDarkStyles = `
      /* cover event pane */
      #eventpane { background: #4f535b !important; border-color: #000000 !important; }
      /* use consistent round cornors */
      div.ido, .stuffbox { border-radius: 9px; }`
    if (/e-hentai\.org\/g\/\d+\/[0-9a-z]+/.test(windowUrl)) {
      // The first two rules replicate the default dark style. The last rule below targets the content warning div when
      // it is there; otherwise it targets the eventpane or .gm, but it will not have an effect beacuse these elements
      // already use this background colour.
      customDarkStyles += `
        div#tagpopup { background: #4f535b; border: 1px solid #000000 }
        div#tagpopup h2:hover { color: #ffffff }
        img.ygm { filter: brightness(100); }
        #nb + div { background: #4f535b !important }`
    } else if (/e-hentai\.org\/mpv\//.test(windowUrl)) {
      customDarkStyles += `
        div.mi2, div.mi3, div#bar3 img { filter: invert(0.8); }`
    } else if (windowUrl.includes('gallerytorrents.php')) {
      customDarkStyles += `
        #torrentinfo > div + div { border-top-color: #000000 !important; }`
    } else if (windowUrl.includes('archiver.php')) {
      scientificDarkStyles += `
        #hathdl_form + table td { border-color: #f1f1f1 !important; }`
    } else if (windowUrl.includes('home.php')) {
      customDarkStyles += `
        div.homebox { border-color: #000000; }
        div.homebox td { border-right-color: #000000 !important; }`
    } else if (windowUrl.includes('stats.php')) {
      customDarkStyles += `
        .stuffbox table { background: #4f535b !important; border-color: #000000 !important; }
        tr > td.stdk, tr > td.stdv { border-color: #000000; }`
      if (windowUrl.includes('gid')) {
        // For the gallery ranking table on the EH-only public gallery statistics page:
        customDarkStyles += `
          table th { border-bottom-color: #000000 !important; }`
      }
    } else if (windowUrl.includes('bitcoin.php')) {
      customDarkStyles += `
        #coinselector > div[onclick] { background-color: #4f535b; }
        #coinselector > div[onclick]:hover { background-color: #43464e; }
        #coinselector > div[onclick]:hover > a { color: #ffffff; }
        #douter > #coinselector > div { border-color: #000000; }
        #adon { border-top-color: #000000; }
        #adon > div:nth-child(3) { border-left-color: #000000; }
        #tdon th { border-bottom-color: #000000; }
        #dlvl { background-color: #34353b; }
        #houter { border-top-color: #000000; }
        #houter > div:nth-child(2) { border-left-color: #000000; }`
    } else if (windowUrl.includes('exchange.php')) {
      customDarkStyles += `
        .stuffbox h2 { border-bottom-color: #000000; }`
    } else if (windowUrl.includes('logs.php?t=credits')) {
      customDarkStyles += `
        #lb + div { border-radius: 9px; background: #4f535b !important; border-color: #000000 !important; }
        #lb + div th { border-bottom-color: #000000 !important; };`
    } else if (windowUrl.includes('logs.php?t=karma')) {
      customDarkStyles += `
        #lb + div + div { border-radius: 9px; background: #4f535b !important; border-color: #000000 !important; }
        #lb + div + div th { border-bottom-color: #000000 !important; };`
    } else if (windowUrl.includes('bounty.php?bid=')) {
      // Fix the colour of the PM icon.
      customDarkStyles += `
        img.ygm { filter: brightness(100); }`
    } else if (windowUrl.includes('bounty.php?act=top')) {
      // Fix the page number arrow when it is not clickable.
      customDarkStyles += `
        div#p > span { color: #73767c; }`
    } else if (windowUrl.includes('bounty_post.php')) {
      customDarkStyles += `
        div.d4, div.d5 { border-color: #000000; }
        #b.stuffbox td.l, #b.stuffbox td.r { border-bottom-color: #000000; }`
    } else if (windowUrl.includes('news.php')) {
      customDarkStyles += `
        .nwo h2, .nwo .newstitle { border-bottom-color: #000000; }`
    } else if (windowUrl.includes('karma.php')) {
      customDarkStyles += `
        body > div:first-child { border-radius: 9px; background: #4f535b !important; border-color: #000000 !important; }
        #as { padding-bottom: 0 !important; background: #4f535b !important; border-color: #aeaeae !important; }`
    } else if (windowUrl.includes('tools.php?act=track_expunge')) {
      // Using the brightness filter seems to disfigure the text in anchor elements on Firefox, so a more hardcoded
      // approach is used below. It is likely caused by bitmap conversion of ClearType text. Revoked expunge petitions
      // will still appear disfigured because they cannot be identified via CSS. If Firefox fixes this problem with
      // ClearType, then a simple filter will be enough.
      customDarkStyles += `
        /* cover everything but avoid application to usernames */
        td:not(:nth-child(3)) { filter: brightness(2); }
        /* avoid application to conflict gallery */
        body > div > div > table > tbody > tr:nth-child(4) > td:nth-child(2),
        /* avoid application to entire tables */
        body > div > div > table > tbody > tr:nth-child(5) > td:nth-child(2),
        body > div > div > table > tbody > tr:nth-child(8) > td:nth-child(2) { filter: none; }`
    } else if (windowUrl.includes('tools.php?act=track_rename')) {
      customDarkStyles += `
        /* cover submitted rename titles */
        body > div > div > div > div:nth-child(1),
        /* cover the vote details but avoid application to current and original titles and usernames */
        body > div > div:nth-child(3) td:not(:nth-child(3)),
        body > div > div:nth-child(5) td:not(:nth-child(3)) { filter: brightness(2); }`
    }

    const scientificDarkStylesElement = appendStyleText(document.documentElement, 'scientificDarkStyles',
      scientificDarkStyles)
    appendStyleText(document.documentElement, 'customDarkStyles', customDarkStyles)

    /**
     * Appends the styles whose applicability can only be determined at the "interactive" ready state.
     */
    const addStylesAtInteractive = function () {
      // The existing "displayMode" variable is not used due to its asynchronous assignment.
      const displayMode = document.body.querySelector('#dms option[selected = "selected"]')
      if (displayMode !== null && displayMode.textContent.toLowerCase() === 'thumbnail') {
        // These are extracted from the style tag in document.head of the search index in the thumbnail display mode.
        scientificDarkStylesElement.textContent += `
          @supports(display:grid) {
            @media screen and (max-width:1080px) {
              .gl1t:nth-child(8n + 1), .gl1t:nth-child(8n + 3), .gl1t:nth-child(8n + 6), .gl1t:nth-child(8n + 8)
                { background: #363940; }
              .gl1t:nth-child(8n + 2), .gl1t:nth-child(8n + 4), .gl1t:nth-child(8n + 5), .gl1t:nth-child(8n + 7)
                { background: #3c414b; }
            }
            @media screen and (max-width:860px) {
              .gl1t:nth-child(2n + 1) { background: #363940; }
              .gl1t:nth-child(2n + 2) { background: #3c414b; }
            }
          }`
      }
    }
    scheduleForInteractive(addStylesAtInteractive)
  }

  /**
   * Applies a full, scientific light theme to the entire gallery system on the applicable domain.
   *
   * This theme is mainly scientifically produced by summarising colour differences between style sheets. Custom styles
   * are added to cover inline styles and style tags from document.head.
   */
  const applyLightTheme = function () {
    // This feature is only applicable to EX, and it covers the entire EX.
    if (!windowUrl.includes('exhentai.org')) {
      return
    }

    // These are the colour differences programmatically extracted from two 0347 style sheets. They do not cover
    // everything because there are inline styles and style tags.
    let scientificLightStyles = `
      body { color: #5C0D11; background: #E3E0D1 }
      a { color: #5C0D11 }
      a:hover { color: #8F4701 }
      /* input */
      input, select, option, optgroup, textarea { color: #5C0D12; background-color: #EDEADA }
      input[type = "button"], input[type = "submit"] { border: 2px solid #B5A4A4 }
      input[type = "button"]:enabled:hover, input[type = "submit"]:enabled:hover, input[type = "button"]:enabled:focus,
        input[type = "submit"]:enabled:focus { background-color: #F3F0E0 !important; border-color: #977273 !important }
      input[type = "button"]:enabled:active, input[type = "submit"]:enabled:active
        { background: radial-gradient(#D7D3C2, #F3F0E0) !important; border-color: #5C0D12 !important }
      input[type = "text"], input[type = "password"], select, textarea { border: 1px solid #B5A4A4 }
      input:disabled, select:disabled, textarea:disabled { color: #C2A8A4; -webkit-text-fill-color: #C2A8A4 }
      input::placeholder, textarea::placeholder { color: #9F746F; -webkit-text-fill-color: #9F746F }
      input[type = "text"]:enabled:hover, input[type = "password"]:enabled:hover, select:enabled:hover,
        textarea:enabled:hover, input[type = "text"]:enabled:focus, input[type = "password"]:enabled:focus,
        select:enabled:focus, textarea:enabled:focus { background-color: #F3F0E0 }
      input[type = "file"] { border: 2px solid #B5A4A4 }
      .lc:hover input:enabled ~ span, .lr:hover input:enabled ~ span, .lc input:enabled:focus ~ span,
        .lr input:enabled:focus ~ span { background-color: #F3F0E0 !important; border-color: #977273 !important }
      .lc input:disabled ~ span, .lr input:disabled ~ span { border-color: #DBD4D3 !important }
      .lc > span { background-color: #EDEADA; border: 2px solid #B5A4A4 }
      .lc > span:after { border: solid #5C0D12 }
      .lr > span { background-color: #EDEADA; border: 2px solid #B5A4A4 }
      .lr > span:after { background: #5C0D12 }
      /* misc */
      .br { color: #FF0000 }
      .stuffbox { background: #EDEBDF; border: 1px solid #5C0D12 }
      /* rating */
      img.th { border: 1px solid #5C0D12 }
      div.ido { background: #EDEBDF; border: 1px solid #5C0D12 }
      /* shared table stuff */
      div.itg { border-top: 2px ridge #5C0D12; border-bottom: 2px ridge #5C0D12 }
      table.itg { border: 2px ridge #5C0D12 }
      table.itg > tbody > tr > th { background: #E0DED3 }
      table.itg > tbody > tr:nth-child(2n + 1), table.itg > tbody > tr:nth-child(2n + 1) .glthumb,
        table.itg > tbody > tr:nth-child(2n + 1) .glcut { background: #F2F0E4 }
      table.itg > tbody > tr:nth-child(2n + 2), table.itg > tbody > tr:nth-child(2n + 2) .glthumb,
        table.itg > tbody > tr:nth-child(2n + 2) .glcut { background: #EDEBDF }
      table.mt { border: 1px solid #5C0D12; background: #E0DED3 }
      table.mt > tbody > tr:nth-child(2n + 1) { background: #F2F0E4 }
      table.mt > tbody > tr:nth-child(2n + 2) { background: #EDEBDF }
      tr.gtr, table.mt > tbody > tr:first-child { background: #EBE8DD !important }
      td.itd { border-right: 1px solid #D9D7CC }
      /* login boxes */
      div.d { border: 1px solid #5C0D12; background: #EDEBDF }
      div.ds { border: 1px solid #5C0D12; background: #EDEBDF }
      /* index */
      div.idi { border: 2px ridge #5C0D12 }
      div#iw { color: #FF0000 }
      /* gallery list */
      a:visited .glink, a:active .glink { color: #8F6063 }
      a:hover .glink { color: #8F4701 }
      .glname a :not(.glink), a .glname :not(.glink) { color: #5C0D11 }
      .glcat { border-right: 1px solid #D9D7CC }
      .glthumb { border: 2px solid #D9D7CC }
      .glthumb > div:nth-child(1) { border: 1px solid #5C0D12 }
      .gltc > tbody > tr > td, .glte > tbody > tr > td { border-right: 1px solid #D9D7CC }
      .gltm > tbody > tr > td { border-right: 1px solid #D9D7CC }
      .gl1c, .gl2c, .gl3c, .gl4c, .glfc { border-top: 1px solid #D9D7CC; border-bottom: 1px solid #D9D7CC }
      .gl1e, .gl2e, .glfe { border-top: 1px solid #D9D7CC; border-bottom: 1px solid #D9D7CC }
      .gl1e > div { border: 1px solid #5C0D12 }
      .gl4e { border-left: 1px solid #D9D7CC }
      .gld { border-left: 1px solid #D9D7CC }
      .gl1t { border-right: 1px solid #D9D7CC; border-bottom: 1px solid #D9D7CC }
      .gl3t { border: 1px solid #5C0D12 }
      .gl1t:nth-child(2n + 1) { background: #F2F0E4 }
      .gl1t:nth-child(2n + 2) { background: #EDEBDF }
      /* category buttons */
      .ct1 { background: radial-gradient(#707070,  #9e9e9e); border: 1px solid #707070 } /* misc */
      .ct2 { background: radial-gradient(#fc4e4e,  #f26f5f); border: 1px solid #fc4e4e } /* doujinshi */
      .ct3 { background: radial-gradient(#e78c1a,  #fcb417); border: 1px solid #e78c1a } /* manga */
      .ct4 { background: radial-gradient(#c7bf07,  #dde500); border: 1px solid #c7bf07 } /* artistcg */
      .ct5 { background: radial-gradient(#1a9317,  #05bf0b); border: 1px solid #1a9317 } /* gamecg */
      .ct6 { background: radial-gradient(#2756aa,  #5f5fff); border: 1px solid #2756aa } /* imageset*/
      .ct7 { background: radial-gradient(#8800c3,  #9755f5); border: 1px solid #8800c3 } /* cosplay */
      .ct8 { background: radial-gradient(#b452a5,  #fe93ff); border: 1px solid #b452a5 } /* asianporn */
      .ct9 { background: radial-gradient(#0f9ebd,  #08d7e2); border: 1px solid #0f9ebd } /* nonh */
      .cta { background: radial-gradient(#5dc13b,  #14e723); border: 1px solid #5dc13b } /* western */
      /* page selector */
      table.ptt { color: #5C0D12 }
      table.ptt td { background: #E3E0D1; border: 1px solid #5C0D12 }
      table.ptt td:hover { color: #9B4E03; background: #F2EFDF }
      table.ptb { color: #5C0D12 }
      table.ptb td { background: #E3E0D1; border: 1px solid #5C0D12 }
      table.ptb td:hover { color: #9B4E03; background: #F2EFDF }
      td.ptds { color: #9B4E03 !important; background: #F2EFDF !important }
      td.ptdd:hover { color: #C2A8A4 !important; background: #E3E0D1 !important }
      /* gallery */
      a.tup { color: green }
      a.tdn { color: red }
      span.tup { color: green }
      span.tdn { color: red }
      div.gm { background: #EDEBDF; border: 1px solid #5C0D12 }
      div#gmid { background: #EDEBDF }
      div#gright { background: #EDEBDF }
      div#gd1 div { border: 1px solid #5C0D12 }
      div#gd2 { background: #EDEBDF }
      h1#gj { color: #9F8687; border-bottom: 1px solid #5C0D12 }
      div#gd4 { border-left: 1px solid #5C0D12; border-right: 1px solid #5C0D12 }
      div#gdt { background: #EDEBDF; border: 1px solid #5C0D12 }
      div#gdt img { border: 1px solid #5C0D12 }
      div.gt { border: 1px solid #806769; background: #F2EFDF }
      div.gtl { border: 1px dashed #9a7c7e; background: #F2EFDF }
      div.gtw { border: 1px dotted #9a7c7e; background: #F2EFDF }
      #gds { background: #F2EFDF }
      #grl { color: #FF0000 }
      div.c2 { background: #E3E0D1; border: 1px solid #F2EFDF }
      div.ths { border: 1px solid #806769; background: #F2EFDF }
      div.tha { border: 1px solid #C2A8A4 }
      div.tha:hover { background: #F2EFDF; color: #9B4E03 }
      div.thd { border: 1px solid #C2A8A4; color: #C2A8A4 }
      /* image pages */
      div.sni { background: #EDEBDF; border: 1px solid #5C0D12 }`

    // These are extracted from the style tags in document.head.
    scientificLightStyles += `
      /* keep the ticks in checkboxes */
      .lc > span:after { border-width: 0 3px 3px 0 !important; }
      /* page-specific */`
    if (/exhentai\.org\/g\/\d+\/[0-9a-z]+\/\?act=expunge/.test(windowUrl)) {
      scientificLightStyles += `
        #gdt.exp_outer { border-color: #5C0D12; }
        .exp_entry { border-color: #B5A4A4; }
        .exp_table { border-color: #5C0D12; }`
    } else if (/exhentai\.org\/mpv\//.test(windowUrl)) {
      scientificLightStyles += `
        div.mi0 { background: #F2EFDF; border: 1px solid #E3E0D1; }`
    } else if (windowUrl.includes('favorites.php')) {
      scientificLightStyles += `
        div.fp:hover { background:#F3F0E0; }
        div.fps { background:#F3F0E0; }
        @supports (display:grid) {
          @media screen and (max-width:1080px) {
            .gl1t:nth-child(8n + 1), .gl1t:nth-child(8n + 3), .gl1t:nth-child(8n + 6), .gl1t:nth-child(8n + 8)
              { background: #F2F0E4; }
            .gl1t:nth-child(8n + 2), .gl1t:nth-child(8n + 4), .gl1t:nth-child(8n + 5), .gl1t:nth-child(8n + 7)
              { background: #EDEBDF; }
          }
        }`
    } else if (windowUrl.includes('mytags')) {
      scientificLightStyles += `
      #usertags_mass > div { border-top: 1px solid #5C0D12; }
      .jscolor { border: 1px solid #B5A4A4; }
      .tagcomplete-items { border: 1px solid #B5A4A4; }
      .tagcomplete-items div { background-color: #EDEBDF; }
      .tagcomplete-items div:not(:last-child) { border-bottom: 1px solid #D4D4D4; }
      .tagcomplete-items div:last-child { border-bottom: 1px solid #B5A4A4; }
      .tagcomplete-items div:hover { background-color: #F3F0E0; }
      .tagcomplete-active { background-color: #5C0D12 !important; color:#EDEBDF; }`
    } else if (windowUrl.includes('managegallery')) {
      scientificLightStyles += `
        td.l { border-bottom: 1px solid #5c0d12; border-right: 1px dashed #5c0d12; }
        td.r { border-bottom: 1px solid #5c0d12; }
        td#d { border-right: 1px dashed #5c0d12; }
        div[id ^= "cell_"] { background: #f3f0e0; border: 1px solid #e3e0d1; }`
      // The upload list also has styles in document.head, but they are the same on both sides. There are only two
      // effective colour properties and they already fit the light theme, so nothing needs to be done.
    } else if (windowUrl.includes('gallerytorrents.php')) {
      scientificLightStyles += `
        table#ett { background: #F2EFDF; border: 1px solid #5C0D12; }
        div#etd { background: #F2EFDF; border: 1px solid #5C0D12; }`
    } else if (windowUrl.includes('archiver.php')) {
      scientificLightStyles += `
        div#db { border: 1px solid #5C0D12; background: #EDEBDF; }`
    }

    // These styles cover the styles not included in the default light styles in style sheet and style tags, so they
    // cannot be scientifically produced. Some of them also override the scientific styles.
    let customLightStyles = ''
    if (/exhentai\.org\/g\/\d+\/[0-9a-z]+/.test(windowUrl)) {
      // The first two rules already exist in the light style sheet, but they were removed during the style extraction
      // process. The last rule below targets the content warning div when it is there; otherwise it targets .gm, but it
      // will not have an effect beacuse this element already uses this background colour.
      customLightStyles += `
        div#tagpopup { background: #EDEBDF; border: 1px solid #5C0D12 }
        div#tagpopup h2:hover { color: #9B4E03 }
        #nb + div { background: #EDEBDF !important }`
    } else if (/exhentai\.org\/mpv\//.test(windowUrl)) {
      customLightStyles += `
        div.mi2, div.mi3, div#bar3 img { filter: invert(0.8); }`
    } else if (windowUrl.includes('karma.php')) {
      // Surprisingly enough, this page also exists on EX, but it is identical to the EH version so nothing needs to be
      // done.
    }

    const scientificLightStylesElement = appendStyleText(document.documentElement, 'scientificLightStyles',
      scientificLightStyles)
    appendStyleText(document.documentElement, 'customLightStyles', customLightStyles)

    /**
     * Appends the styles whose applicability can only be determined at the "interactive" ready state.
     */
    const addStylesAtInteractive = function () {
      // The existing "displayMode" variable is not used due to its asynchronous assignment.
      const displayMode = document.body.querySelector('#dms option[selected = "selected"]')
      if (displayMode !== null && displayMode.textContent.toLowerCase() === 'thumbnail') {
        // These are extracted from the style tag in document.head of the search index in the thumbnail display mode.
        scientificLightStylesElement.textContent += `
          @supports(display:grid) {
            @media screen and (max-width:1080px) {
              .gl1t:nth-child(8n + 1), .gl1t:nth-child(8n + 3), .gl1t:nth-child(8n + 6), .gl1t:nth-child(8n + 8)
                { background: #F2F0E4; }
              .gl1t:nth-child(8n + 2), .gl1t:nth-child(8n + 4), .gl1t:nth-child(8n + 5), .gl1t:nth-child(8n + 7)
                { background: #EDEBDF; }
            }
            @media screen and (max-width:860px) {
              .gl1t:nth-child(2n + 1) { background: #F2F0E4; }
              .gl1t:nth-child(2n + 2) { background: #EDEBDF; }
            }
          }`
      }
    }
    scheduleForInteractive(addStylesAtInteractive)
  }

  /**
   * Relocates the thumbnail pane and its scroll bar to the right side in the MPV, which should be more natural to use.
   *
   * This function is simple enough to be added at the "loading" ready state to avoid visible transitions.
   */
  const relocateMpvThumbnails = function () {
    if (!/e(?:-|x)hentai\.org\/mpv\/\d+/.test(windowUrl)) {
      return
    }

    const mpvRelocationStyles = `
      div#pane_thumbs { left: auto; right: 0px; z-index: 1; }
      div#pane_images { left: 0; }
      div#bar2 { float: left; }
      div#bar3 > img[title="Show Thumbnail Pane"] { transform: scaleX(-1); }`
    appendStyleText(document.documentElement, 'mpvRelocationStyles', mpvRelocationStyles)
  }

  /**
   * Hides the vertical toolbar in the MPV, which can rest on top of images, and only reveals it on hover.
   */
  const hideMpvToolbar = function () {
    if (!/e(?:-|x)hentai\.org\/mpv\/\d+/.test(windowUrl)) {
      return
    }

    // div.mi2 and div.mi3 have "z-index: 2", so "z-index: 3" is needed below to ensure the toolbar will show on hover.
    const mpvToolbarStyles = `
      div#bar1 { position: absolute; z-index: 3; opacity: 0; transition-duration: 0.3s; }
      div#bar1:hover { opacity: 1; }`
    appendStyleText(document.head, 'mpvToolbarStyles', mpvToolbarStyles)
  }

  /**
   * Runs feature functions at the "interactive" ready state, which belong to feature function group 2 to 6.
   */
  const runFeaturesAtInteractive = function () {
    // If the Firefox compatibility mode is enabled, then the features run at the "loading" ready state by default will
    // be loaded here instead to ensure they will always be able to run on Firefox, at the cost of causing noticeable
    // visual changes when they are loaded.
    if (settings.script.firefoxCompatibilityEnabled) {
      // Group 1: functions that can run before DOM elements are loaded.
      settings.applyDarkTheme.featureEnabled && applyDarkTheme()
      settings.applyLightTheme.featureEnabled && applyLightTheme()
      settings.relocateMpvThumbnails.featureEnabled && relocateMpvThumbnails()
      settings.hideMpvToolbar.featureEnabled && hideMpvToolbar()
    }

    initialiseAtInteractive()

    // Group 2: functions that need to happen very quickly.
    // Currently empty.

    // Group 3: functions that need to run before others to change what content is displayed.
    settings.applyAdditionalFilters.featureEnabled && applyAdditionalFilters()
    settings.applyTextFilters.featureEnabled && applyTextFilters()
    settings.applyDesignFixes.featureEnabled && applyDesignFixes()
    settings.improveNavigationBar.featureEnabled && improveNavigationBar()
    settings.addVigilanteLinks.featureEnabled && addVigilanteLinks()
    settings.showAlternativeRating.featureEnabled && showAlternativeRating()
    settings.addGuideLinks.featureEnabled && addGuideLinks()

    // Group 4: functions that change how content is displayed.
    settings.applySubjectiveFixes.featureEnabled && applySubjectiveFixes()
    settings.emptyCategoryFilter.featureEnabled && emptyCategoryFilter()
    settings.fitThumbnailTitles.featureEnabled && fitThumbnailTitles()
    settings.colourCodeGalleries.featureEnabled && colourCodeGalleries()
    settings.fitViewerToScreen.featureEnabled && fitViewerToScreen()
    settings.fitMpvToScreen.featureEnabled && fitMpvToScreen()

    // Group 5: functions that require user input to activate and can hence load late.
    addControlPanel()
    settings.useAutomatedDownloads.featureEnabled && useAutomatedDownloads()
    settings.openGalleriesSeparately.featureEnabled && openGalleriesSeparately()
    settings.addJumpButtons.featureEnabled && addJumpButtons()
    settings.parseExternalLinks.featureEnabled && parseExternalLinks()
    settings.removeMpvTooltips.featureEnabled && removeMpvTooltips()

    // Group 6: functions that are not immediately required.
    settings.collectDawnReward.featureEnabled && collectDawnReward()
  }

  /**
   * Prepares shared variables and CSS styles to support functions running at the "interactive" ready state.
   */
  const initialiseAtInteractive = function () {
    displayMode = document.body.querySelector('#dms option[selected = "selected"]')
    if (displayMode !== null) {
      // This includes the popular list, which lacks the top and bottom page numbers and the search result message.
      pageType = 'gallery list'
      displayMode = displayMode.textContent.toLowerCase()
    } else if (/e-hentai\.org\/toplist\.php\?tl=(?:11|12|13|15)/.test(windowUrl)) {
      // These are gallery toplists and they do not have the display mode selector and the search result message.
      pageType = 'gallery list'
      // Gallery toplists always use the compact display mode.
      displayMode = 'compact'

      // Recreate the display mode selector div, so that control buttons can be added to it when needed.
      const dmsDiv = document.createElement('div')
      dmsDiv.id = 'dms'
      // Adjust the vertical position to keep button positions consistent.
      dmsDiv.setAttribute('style', 'position: absolute; top: 29px')
      const pageTableTop = document.getElementsByClassName('ptt')[0]
      pageTableTop.parentNode.insertBefore(dmsDiv, pageTableTop)
    } else if (/e(?:-|x)hentai\.org\/g\/\d+\/[0-9a-z]+/.test(windowUrl)) {
      if (xpathSelector(document, './/a[text() = "Get Me Outta Here"]') !== null) {
        pageType = 'content warning'
      } else {
        pageType = 'gallery view'
      }
    } else if (/e(?:-|x)hentai\.org\/mpv\/\d+\/[0-9a-z]+/.test(windowUrl)) {
      pageType = 'MPV view'
    } else if (/e(?:-|x)hentai\.org\/s\/[0-9a-z]+/.test(windowUrl)) {
      pageType = 'image view'
    } else if (/upload\.e-hentai\.org|exhentai\.org\/upload/.test(windowUrl)) {
      pageType = 'upload management'
    } else if (windowUrl.includes('forums.e-hentai.org')) {
      pageType = 'EH forums'
    } else if (windowUrl.includes('hentaiverse.org')) {
      pageType = 'HentaiVerse'
    } else {
      pageType = 'other'
    }

    // Add the compulsory styles that are either always needed or required by multiple features. In the styles below:
    // 1. "z-index" on config buttons is needed for pony mode compatibility: #cancelConfigButton needs "z-index: 4"
    //    because otherwise it would be totally blocked by ponies, which have "z-index: 3". #saveConfigButton hence also
    //    uses this for consistency. #openConfigButton does not use this since it is not fully blocked, and this allows
    //    the ponies to be fully visible when the control panel is not open.
    // 2. "min-height" on #controlPanel tr prevents empty rows from being collapsed and allows text wrap in each row
    //    when needed.
    let requiredCommonStyles = `
      /* control panel */
      #controlPanel tbody { display: block; }
      #controlPanel tr { display: block; min-height: 35px; padding: 0 10px; line-height: 35px; }
      #controlPanel tr.indent1 { padding-left: 28px; }
      #controlPanel tr.indent2 { padding-left: 46px; }
      #controlPanel .boldText { font-weight: bold; }
      input[type = "checkbox"] { margin: 0 5px 0 0; }
      #controlPanel input[type = "text"] { padding: 3px 5px; margin: 0 5px; }
      #controlPanel select { padding: 3px 1px; margin: 0 5px; }
      /* DMS style buttons */
      input[type = "button"].dmsStyleButtons { padding: 0; font-weight: bold; line-height: 17px; border-width: 1px; }
      #dms > div > input { min-height: 25px; height: 25px; position: absolute; margin: 3px 1px 0; font-size: 10pt; }
      #dms > div > select { height: 25px; }
      #dms > #configButtonHost { float: left; }
      #openConfigButton { width: 185px; left: 9px; }
      #saveConfigButton { width: 93px; border-radius: 3px 0 0 3px; left: 9px; z-index: 4; }
      #cancelConfigButton { width: 93px; border-radius: 0 3px 3px 0; left: 101px; z-index: 4; }
      #additionalFiltersButton { width: 185px; left: ${windowUrl.includes('toplist.php') ? -65 : -190}px; }`
    if (windowUrl.includes('popular')) {
      requiredCommonStyles += `
        .dmsp > div > select, #dms > div > input { top: -31px !important; }`
    } else {
      requiredCommonStyles += `
        #dms > div > input { top: -13px; }`
    }
    appendStyleText(document.head, 'requiredCommonStyles', requiredCommonStyles)
  }

  /**
   * Applies additional third-stage gallery list filters to all types of gallery lists, except for gallery toplists.
   *
   * This feature includes three filters, which remove galleries from gallery lists based on ratings and favorite
   * categories given by the user, and displayed gallery titles. The first two filters work on gallery chains and
   * securely hide individual galleries and their future updates, but they cannot work on toplists, because toplists do
   * not show rated and favorited statuses like other gallery lists. Although the gallery title filter can still work on
   * toplists, this filter is still disabled on gallery toplists to keep the application of filters consistent.
   *
   * Another problem that cannot be fixed is that the rated filter cannot detect yellow stars, which is not enabled by
   * default but can be manually configured in the EH gallery settings.
   */
  const applyAdditionalFilters = function () {
    if (pageType !== 'gallery list' || windowUrl.includes('toplist.php')) {
      return
    }

    const shortcuts = settings.applyAdditionalFilters
    const gallerySelector = displayMode === 'thumbnail' ? '.itg.gld > .gl1t' : 'tbody > tr'
    let filteredCount = 0

    /**
     * Removes rated galleries to which certain numbers of stars have been given by the user.
     *
     * Note that by default the stars on rated galleries will be red, green or blue, but in the user's EH gallery
     * settings, it is also possible to use yellow stars that are identical to stars on unrated galleries. It is
     * technically impossible to distinguish rated galleries with yellow stars from unrated ones, so yellow stars cannot
     * be supported.
     */
    const filterRatedGalleries = function () {
      // This filter can be disabled by the user on the favorite and/or popular list via control panel.
      if (windowUrl.includes('favorites.php') && shortcuts.ratedFilterExceptionEnabled &&
        shortcuts.ratedFilterExceptions.includes('the favorite list')) {
        return
      } else if (windowUrl.includes('popular') && shortcuts.ratedFilterExceptionEnabled &&
        shortcuts.ratedFilterExceptions.includes('the popular list')) {
        return
      }

      let ratedMarks
      // The class names of red, green and blue stars are .ir.irr, .ir.irg and .ir.irb respectively, but that of yellow
      // stars is just .ir, which is identical to ordinary yellow stars on unrated galleries. Each gallery also has two
      // rating elements due to the thumbnail overlays in the first three display modes below.
      switch (displayMode) {
        case 'minimal':
        case 'minimal+':
          ratedMarks = document.body.querySelectorAll('.gl4m > .irr, .gl4m > .irg, .gl4m > .irb')
          break
        case 'compact':
          ratedMarks = document.body.querySelectorAll('div[id ^= "posted_"] + .irr, div[id ^= "posted_"] + .irg, ' +
            'div[id ^= "posted_"] + .irb')
          break
        case 'extended':
        case 'thumbnail':
          ratedMarks = document.body.querySelectorAll('.irr, .irg, .irb')
      }

      if (shortcuts.ratedFilterStars === 'all') {
        removeGalleries(ratedMarks)
      } else {
        const targetChildNodes = []
        for (const ratedMark of ratedMarks) {
          const starSheetCoordinates = ratedMark.style.backgroundPosition.match(/(0|-\d+)px (-1|-21)px/)
          const starsGiven = 5 - (+starSheetCoordinates[1] / -16) - (+starSheetCoordinates[2] === -1 ? 0 : 0.5)
          if (shortcuts.ratedFilterStars.includes(starsGiven)) {
            targetChildNodes.push(ratedMark)
          }
        }
        removeGalleries(targetChildNodes)
      }
    }

    /**
     * Removes favorited galleries which have been added to certain favorite categories by the user.
     */
    const filterFavoritedGalleries = function () {
      // This filter is always disabled on the favorite list, and can be disabled by the user on the popular list via
      // control panel.
      if (windowUrl.includes('favorites.php')) {
        return
      } else if (windowUrl.includes('popular') && shortcuts.favoritedFilterExceptionEnabled) {
        return
      }

      // This is not affected by the display mode, because the duplicates of these elements below thumbnail overlays
      // use a different id format.
      const favoritedMarks = document.body.querySelectorAll('div[id ^= "posted_"][title]')
      if (shortcuts.favoritedFilterCategories === 'all') {
        removeGalleries(favoritedMarks)
      } else {
        const targetChildNodes = []
        for (const favoritedMark of favoritedMarks) {
          if (shortcuts.favoritedFilterCategories.includes(favoritedMark.title.toLowerCase())) {
            targetChildNodes.push(favoritedMark)
          }
        }
        removeGalleries(targetChildNodes)
      }
    }

    /**
     * Removes galleries whose displayed titles in gallery lists have at least one match with the keywords or regular
     * expression set by the user.
     *
     * Note that the displayed titles in gallery lists can be the english/romanised titles, or the original Japanese
     * titles depending on the "gallery name display" option in the user's EH gallery settings, so the user should be
     * aware of this when entering the keywords or regular expression.
     */
    const filterGallleryTitles = function () {
      // This filter can be disabled by the user on the favorite and/or popular list via control panel.
      if (windowUrl.includes('favorites.php') && shortcuts.titleFilterExceptionEnabled &&
        shortcuts.titleFilterExceptions.includes('the favorite list')) {
        return
      } else if (windowUrl.includes('popular') && shortcuts.titleFilterExceptionEnabled &&
        shortcuts.titleFilterExceptions.includes('the popular list')) {
        return
      }

      const galleryTitles = document.body.querySelectorAll('.glink')
      const targetChildNodes = []
      if (shortcuts.titleFilterType === 'one of the keywords') {
        for (const galleryTitle of galleryTitles) {
          const title = galleryTitle.textContent.toLowerCase()
          for (const keyword of shortcuts.titleFilterKeywords) {
            if (title.includes(keyword)) {
              targetChildNodes.push(galleryTitle)
              break
            }
          }
        }
      } else {
        const filterRegex = new RegExp(shortcuts.titleFilterKeywords, 'i')
        for (const galleryTitle of galleryTitles) {
          if (filterRegex.test(galleryTitle.textContent)) {
            targetChildNodes.push(galleryTitle)
          }
        }
      }
      removeGalleries(targetChildNodes)
    }

    /**
     * Helps other functions to locate gallery DOM elements from their child nodes and remove these galleries.
     *
     * @param {HTMLElement[]} targetChildNodes - A potentially empty NodeList containing the child nodes of the
     * galleries to be removed.
     */
    const removeGalleries = function (targetChildNodes) {
      if (targetChildNodes.length > 0) {
        for (const targetChildNode of targetChildNodes) {
          const gallery = targetChildNode.closest(gallerySelector)
          gallery.parentNode.removeChild(gallery)
        }
        filteredCount += targetChildNodes.length
      }
    }

    /**
     * Modifies the "showing * results" message to mention how many galleries have been excluded by additional filters.
     */
    const updateResultMessage = function () {
      // This function does not need to run on the two lists below because they do not have the search result message.
      if (windowUrl.includes('popular') || windowUrl.includes('toplist.php')) {
        return
      }

      const resultMessage = xpathSelector(document, './/p[@class = "ip"][starts-with(text(), "Showing")]')
      resultMessage.id = 'additionalFiltersResults'
      const alreadyFiltered = resultMessage.textContent.match(/Your filters excluded (\d+) galler(?:y|ies)/)
      if (alreadyFiltered === null) {
        // The standard second-stage filters from the site are not active. An exception is the watched page, but it is
        // not possible to determine whether the second-stage filters have been active, so this exception is ignored.
        resultMessage.textContent += `. The additional filters excluded ${filteredCount} ${filteredCount > 1
          ? 'galleries' : 'gallery'}`
      } else {
        // When standard second-stage filters have already excluded some galleries, the message is only slightly
        // modified to avoid making the message overlap with the additional filter button.
        resultMessage.textContent = resultMessage.textContent.replace(alreadyFiltered[0], 'Your filters excluded ' +
          `${alreadyFiltered[1]} + ${filteredCount} galleries`)
        resultMessage.title = `The standard filters excluded ${alreadyFiltered[1]} ${+alreadyFiltered[1] > 1
          ? 'galleries' : 'gallery'} and the additional filters excluded ${filteredCount} ${filteredCount > 1
          ? 'galleries' : 'gallery'}`
      }
    }

    /**
     * Shows a message panel in the gallery list when all results have been removed by these additional filters.
     *
     * This function is not called when the list is emptied by second-stage filters, because in this case the site would
     * have already shown an equivalent message panel.
     */
    const showNoResultsPanel = function () {
      // Replicate the style of the standard "no unfiltered result" message panel from second-stage filters.
      const noResultsTable = document.createElement('table')
      noResultsTable.className = 'itg'
      const noResultsMessage = noResultsTable.insertRow().insertCell()
      noResultsMessage.setAttribute('style', 'padding: 10px 0; font-style: italic; text-align: center;')

      // If the list has been emptied on the popular list or gallery toplists, it must be the work of these additional
      // filters only and not the second-stage filters. On gallery lists other than these two types,
      // #additionalFiltersResults from updateResultMessage() must exist since filteredCount > 0, and whether the
      // second-stage filters have been active can be checked.
      if (!windowUrl.includes('popular') && !windowUrl.includes('toplist.php') &&
        document.getElementById('additionalFiltersResults').textContent.includes('+')) {
        noResultsMessage.textContent = 'The standard and additional filters have excluded all galleries on this ' +
          'particular page.'
      } else {
        noResultsMessage.textContent = 'The additional filters have excluded all galleries on this particular page.'
      }

      const galleryList = document.getElementsByClassName('itg')[0]
      galleryList.parentNode.insertBefore(noResultsTable, galleryList)
      galleryList.parentNode.removeChild(galleryList)
    }

    shortcuts.ratedFilterEnabled && filterRatedGalleries()
    shortcuts.favoritedFilterEnabled && filterFavoritedGalleries()
    shortcuts.titleFilterEnabled && filterGallleryTitles()
    if (filteredCount > 0) {
      updateResultMessage()
      if (document.getElementsByClassName('glink').length === 0) {
        showNoResultsPanel()
      }
    }
  }

  /**
   * Applies user and word filters to selectively remove gallery comments, forum posts and forum threads.
   *
   * It also includes a spam filter, but it is not needed at the moment.
   */
  const applyTextFilters = function () {
    if (pageType !== 'gallery view' && pageType !== 'EH forums') {
      return
    }

    // Checking for the script elements below is more secure and readable than checking the URL, which may vary even for
    // the same page type.
    let forumPageType
    if (pageType === 'EH forums') {
      if (document.body.querySelector('script[src = "jscripts/ipb_topic.js"]') !== null) {
        forumPageType = 'thread view'
      } else if (document.body.querySelector('script[src = "jscripts/ipb_forum.js"]') !== null) {
        forumPageType = 'forum view'
      } else if (document.body.querySelector('script[src = "jscripts/ipb_board.js"]') !== null) {
        forumPageType = 'board view'
      } else if (document.getElementById('navstrip').textContent.includes('Search Engine') &&
        windowUrl.includes('result_type=posts')) {
        // This is the view when post or thread search results are displayed as posts.
        forumPageType = 'thread-post view'
      }
    }

    // Spam definition is stored here for now.
    const spamDefinition = ['zeo.kr', 'ssumro.xyz', 'sex4doll.com']
    const shortcuts = settings.applyTextFilters

    /**
     * Removes comments in gallery view by checking the commentator names for blocked users.
     */
    const filterCommentsByUsername = function () {
      const commentList = document.getElementById('cdiv')
      const commentators = commentList.querySelectorAll('.c3 > a:first-of-type')
      for (const commentator of commentators) {
        if (shortcuts.commentatorFilterUsernames.includes(commentator.textContent)) {
          commentList.removeChild(commentator.closest('.c1'))
        }
      }
    }

    /**
     * Removes comments in gallery view by checking the comment contents for blocked keywords.
     */
    const filterCommentsByKeyword = function () {
      const commentList = document.getElementById('cdiv')
      const comments = document.body.querySelectorAll('.c6')
      for (const comment of comments) {
        const keywords = decideKeywords(shortcuts.commentFilterKeywords)
        for (const keyword of keywords) {
          if (comment.textContent.toLowerCase().includes(keyword)) {
            commentList.removeChild(comment.closest('.c1'))
            break
          }
        }
      }
    }

    /**
     * Removes posts in thread view and thread-post view by checking the poster names for blocked users.
     */
    const filterPostsByUsername = function () {
      let posters
      if (forumPageType === 'thread view') {
        posters = document.body.querySelectorAll('.bigusername > a')
      } else {
        posters = document.body.querySelectorAll('.normalname a')
      }
      for (const poster of posters) {
        if (shortcuts.posterFilterUsernames.includes(poster.textContent)) {
          removePost(poster)
        }
      }
    }

    /**
     * Removes posts in thread view and thread-post view by checking the post contents for blocked keywords.
     */
    const filterPostsByKeyword = function () {
      const posts = document.body.querySelectorAll('.postcolor')
      const keywords = decideKeywords(shortcuts.postFilterKeywords)
      for (const post of posts) {
        for (const keyword of keywords) {
          if (post.textContent.toLowerCase().includes(keyword)) {
            removePost(post)
            break
          }
        }
      }
    }

    /**
     * Removes threads in forum view by checking the thread starter names for blocked users.
     */
    const filterThreadsByUsername = function () {
      const threadList = document.body.querySelector('.borderwrap > .ipbtable > tbody')
      // The class name of the td below is different between the two forum themes and can be either .row1 or .row2.
      const posters = threadList.querySelectorAll('td > a[href ^= "https://forums.e-hentai.org/index.php?showuser="]')
      for (const poster of posters) {
        // Usernames are not converted to lowercase.
        if (shortcuts.posterFilterUsernames.includes(poster.textContent)) {
          threadList.removeChild(poster.closest('tr'))
        }
      }
    }

    /**
     * Removes threads in forum view by checking the thread titles for blocked keywords.
     */
    const filterThreadsByKeyword = function () {
      const threadList = document.body.querySelector('.borderwrap > .ipbtable > tbody')
      const threads = threadList.querySelectorAll('a[id ^= "tid-link-"][title]')
      const keywords = decideKeywords(shortcuts.postFilterKeywords)
      for (const thread of threads) {
        for (const keyword of keywords) {
          if (thread.textContent.toLowerCase().includes(keyword)) {
            threadList.removeChild(thread.closest('tr'))
            break
          }
        }
      }
    }

    /**
     * Censors blocked usernames in the "last action" column in forum view.
     */
    const censorLastActionByUsername = function () {
      const lastActionUsers = document.body.querySelectorAll('.lastaction > b > ' +
      'a[href ^= "https://forums.e-hentai.org/index.php?showuser="]')
      for (const lastActionUser of lastActionUsers) {
        if (shortcuts.posterFilterUsernames.includes(lastActionUser.textContent)) {
          lastActionUser.textContent = '<blocked user>'
        }
      }
    }

    /**
     * Censors blocked usernames in the "last post info" column in board view.
     */
    const censorLastPostByUsername = function () {
      const lastPostUsers = document.body.querySelectorAll('a[title = "Go to the last post"] + span > ' +
        'a[href ^= "https://forums.e-hentai.org/index.php?showuser="]')
      for (const lastPostUser of lastPostUsers) {
        if (shortcuts.posterFilterUsernames.includes(lastPostUser.textContent)) {
          lastPostUser.textContent = '<blocked user>'
        }
      }
    }

    /**
     * Censors thread titles with blocked keywords in the "last post info" column in board view.
     */
    const censorLastPostByKeyword = function () {
      const lastPostThreads = document.body.querySelectorAll('a[title *= "Go to the first unread post:"]')
      const keywords = decideKeywords(shortcuts.postFilterKeywords)
      for (const lastPostThread of lastPostThreads) {
        for (const keyword of keywords) {
          if (lastPostThread.textContent.toLowerCase().includes(keyword)) {
            lastPostThread.textContent = '<blocked thread>'
            break
          }
        }
      }
    }

    /**
     * Joins the spam definition with user-defined keywords to produce the array of keywords to be blocked.
     *
     * @param {(string[]|string)} defaultKeywords - An empty string or non-empty array of user-defined strings to block.
     * @returns {string[]} A non-empty array of strings containing the user-defined strings and/or the spam definition.
     */
    const decideKeywords = function (defaultKeywords) {
      if (shortcuts.spamFilterEnabled) {
        if (Array.isArray(defaultKeywords)) {
          return defaultKeywords.concat(spamDefinition)
        } else {
          return spamDefinition
        }
      } else {
        // In this case, this function is called because a keyword-blocking sub-feature is enabled, so defaultKeywords
        // must be an array because the control panel requires a non-empty list when it is enabled.
        return defaultKeywords
      }
    }

    /**
     * Helps other functions to locate DOM elements for a post from its child node and remove this post.
     *
     * @param {HTMLElement[]} targetChildNode - A child node of the main body element of the post to be removed.
     */
    const removePost = function (targetChildNode) {
      // The elements in the two forum themes are named differently. The postList in the fusion theme is tried first
      // since it is easier.
      let postList = document.getElementById('ipbwrapper')
      if (postList === null) {
        postList = document.querySelector('div.page > div:not(.copyright)')
      }
      const postBody = targetChildNode.closest('.borderwrap')
      // This function handles both thread view and thread-post view; the difference is there is one extra element for
      // each post in thread view.
      if (forumPageType === 'thread view') {
        // The header above each post is not a child of the post element outside search results, so it needs to be
        // removed separately.
        postList.removeChild(postBody.previousElementSibling)
      }
      // Remove <br> to ensure consistent spacing.
      postList.removeChild(postBody.previousElementSibling)
      postList.removeChild(postBody)
    }

    // Check the specific page type and run applicable functions that have been enabled.
    if (pageType === 'gallery view') {
      if (shortcuts.commentatorFilterEnabled) {
        filterCommentsByUsername()
      }
      if (shortcuts.commentFilterEnabled || shortcuts.spamFilterEnabled) {
        filterCommentsByKeyword()
      }
    } else if (forumPageType === 'thread view' || forumPageType === 'thread-post view') {
      if (shortcuts.posterFilterEnabled && shortcuts.posterFilterType.includes('posts')) {
        filterPostsByUsername()
      }
      if ((shortcuts.postFilterEnabled && shortcuts.postFilterType.includes('posts')) ||
        shortcuts.spamFilterEnabled) {
        filterPostsByKeyword()
      }
    } else if (forumPageType === 'forum view') {
      if (shortcuts.posterFilterEnabled && shortcuts.posterFilterType.includes('threads')) {
        filterThreadsByUsername()
      }
      if ((shortcuts.postFilterEnabled && shortcuts.postFilterType.includes('threads')) ||
        shortcuts.spamFilterEnabled) {
        filterThreadsByKeyword()
        // For the forum view where a list of subforums is also displayed on top.
        censorLastPostByKeyword()
      }
      if (shortcuts.posterFilterEnabled && shortcuts.posterFilterType.includes('posts')) {
        censorLastActionByUsername()
        // For the forum view where a list of subforums is also displayed on top.
        censorLastPostByUsername()
      }
    } else if (forumPageType === 'board view') {
      if (shortcuts.posterFilterEnabled && shortcuts.posterFilterType.includes('posts')) {
        censorLastPostByUsername()
      }
      if ((shortcuts.postFilterEnabled && shortcuts.postFilterType.includes('threads')) ||
        shortcuts.spamFilterEnabled) {
        censorLastPostByKeyword()
      }
    }
  }

  /**
   * Fixes website design problems throughout the gallery system.
   *
   * Currently this function changes what is displayed so it is in function group 3. The fixes in this feature should
   * be useful to Tenboro, although there are still a few more bugs that cannot be fixed here.
   */
  const applyDesignFixes = function () {
    // This feature does not have fixes for HV.
    if (pageType === 'HentaiVerse') {
      return
    }

    // Redirect to a working search page when directly searching for an uploader whose username contains a forward slash
    // (/) by clicking the uploader username in gallery view, because the username is not encoded and the site will
    // interpret the slash as part of the URL and return 404 not found.
    if (/e(?:-|x)hentai\.org\/uploader\/.+?%2F/.test(windowUrl)) {
      const uploader = windowUrl.match(/e(?:-|x)hentai\.org\/uploader\/(.+)/)[1]
      document.location.href = `https://e-hentai.org/?f_cats=0&f_search=uploader%3A${uploader}`
      return
    }

    let designFixesStyles = ''

    if (pageType === 'gallery list') {
      // Fix the colour used for the titles of visited galleries, because the default colour is not distinct enough. The
      // new colour in each theme is calculated by blending the background colour of div.ido and the colour of unvisited
      // titles in the ratio of 3:1.
      if ((windowUrl.includes('e-hentai.org') && settings.applyDarkTheme.featureEnabled) ||
        (windowUrl.includes('exhentai.org') && !settings.applyLightTheme.featureEnabled)) {
        designFixesStyles += `
          /* improve the colour of visited titles */
          a:visited .glink, a:active .glink { color: #73767c }`
      } else {
        designFixesStyles += `
          /* improve the colour of visited titles */
          a:visited .glink, a:active .glink { color: #C9B4AC }`
      }

      // Fix the message "no unfiltered results in this page range" from second-stage filters. It has two problems:
      // 1. The colspan of this message's row in minimal(+) display modes is one column short.
      // 2. The table header row exists in all display modes other than extended, which is inconsistent, and it should
      //    not exist in the thumbnail gallery list display mode, which does not use a details table.

      // Unlike the others, the td element for this message does not have a class but has a colspan attribute.
      const noResultsMessage = document.body.querySelector('.itg td[colspan]:not([class])')
      if (noResultsMessage !== null && displayMode !== 'extended') {
        // The header row is deleted to solve all problems at once, since it is not needed when the result is empty.
        noResultsMessage.parentNode.parentNode.removeChild(noResultsMessage.parentNode.previousElementSibling)
      }

      // Fix the lack of space at the beginning of the popular list on EX to accommodate the display mode selector.
      if (windowUrl === 'https://exhentai.org/popular') {
        // The heading on EH is recreated here to make space while maintaining consistency.
        const heading = document.createElement('h1')
        heading.className = 'ih'
        heading.textContent = 'Currently Popular Recent Galleries'
        document.getElementById('toppane').appendChild(heading)
      }

      // Fix the wording of the search result message. The popular list and gallery toplists are excluded since they do
      // not have this message.
      if (!windowUrl.includes('popular') && !windowUrl.includes('toplist')) {
        const resultMessage = xpathSelector(document, './/p[@class = "ip"][starts-with(text(), "Showing")]')

        // Change the "your filters excluded * galleries from this page" part to say "page range" when the gallery list
        // is showing filtered results from multiple pages at once.
        if (document.getElementsByClassName('ptds')[0].textContent.includes('-')) {
          resultMessage.textContent = resultMessage.textContent.replace('this page', 'this page range')
        }

        // Change the "showing * galleries" part to say "showing * out of * galleries", where the first number is the
        // actual number of galleries in the current list and the second is the total number of galleries found in a
        // search before deductions from the standard second-stage filters, the additional filters from this script, and
        // indexing delay. Since this feature function runs after applyAdditionalFilters(), the effects of additional
        // filters will be included and the correct count will be shown. However, the effect of indexing delay cannot be
        // accounted for, which probably mainly affects updated galleries.
        const totalGalleries = resultMessage.textContent.match(/Showing ([0-9,]+) results?/)[1]
        const visibleGalleries = document.body.querySelectorAll('.glink').length
        resultMessage.textContent = resultMessage.textContent.replace(totalGalleries,
          `${visibleGalleries} out of ${totalGalleries}`)
      }

      // DISABLED: It has been discovered that the adjustment needed differs by pony, browser and gallery list type, and
      // it is too difficult to fix the ponies completely.
      /*
      // Fix the vertical position of ponies so that they align with the border of gallery lists.
      const pony = document.body.querySelector('img[src ^= "https://ehgt.org/g/ponies/"]')
      if (pony !== null) {
        // Ponies have different sizes and absolute positions, but the vertical gap is always the same, so translateY()
        // can be used. This should not cause subpixel rendering.
        pony.parentNode.style.transform = 'translateY(4px)'
      }
      */
    } else if (windowUrl.includes('stats.php')) {
      // Fix the missing border at the top-right corner of each bar graph.
      for (const td of document.body.querySelectorAll('td[colspan]')) {
        // Compared to the private statistics page for a user, the public statistics page for a gallery includes an
        // additional gallery ranking table. This table is not a bar graph and does not contain "td.stdb".
        const barCount = td.parentNode.parentNode.querySelectorAll('td.stdb').length
        if (barCount > 0) {
          td.setAttribute('colspan', barCount + 1)
        }
      }
      // The title and style sheet are both in the body on this page. That is not appropriate, but they do not really
      // need to be fixed, so they are not moved. Also, this page seems unnecessarily wide, but such a wide page may be
      // (eventually) needed for users with many years of statistics to show, and is hence not changed.
    } else if (pageType === 'upload management' || windowUrl.includes('repo.e-hentai.org')) {
      // Recreate the navigation bar using the new style on these pages, which still use the old navigation bar. They
      // use the old 0338 style sheet, so the new styles from 0347 are added to support the recreated bar. Swapping
      // the style sheet makes little difference, so it is not worth a total reflow.
      designFixesStyles += `
        /* navigation bar (v0347) */
        #nb { margin: auto; padding: 4px 10px 0; text-align: center; font-size:10pt; font-weight: bold;
          color: #AAAAAA; white-space: nowrap; overflow: hidden; min-width: 630px; max-width: 700px; display: flex;
          flex-direction: row; justify-content: space-around; align-items: center; flex-wrap: wrap; line-height: 19px;
          min-height: 19px; max-height: 19px; }
        #nb:hover { max-height: 38px; }
        #nb > div { background-image: url(https://ehgt.org/g/mr.gif); background-repeat: no-repeat;
          background-position: left center; padding: 0 14px 0 7px; }
        #nb a { text-decoration: none; font-weight: bold; }
        #lb { margin: 4px auto 2px; text-align: center; font-size: 9pt; }
        #lb a { text-decoration: none; }`

      const newBar = document.createElement('div')
      const site = windowUrl.includes('e-hentai.org') ? 'e-hentai.org' : 'exhentai.org'
      addNavigationButton(newBar, 'Front Page', `https://${site}/`)
      addNavigationButton(newBar, 'Watched', `https://${site}/watched`)
      addNavigationButton(newBar, 'Popular', `https://${site}/popular`)
      addNavigationButton(newBar, 'Torrents', `https://${site}/torrents.php`)
      addNavigationButton(newBar, 'Favorites', `https://${site}/favorites.php`)
      if (windowUrl.includes('upload.e-hentai.org') || windowUrl.includes('repo.e-hentai.org')) {
        addNavigationButton(newBar, 'My Home', 'https://e-hentai.org/home.php')
        addNavigationButton(newBar, 'My Uploads', 'https://upload.e-hentai.org/manage.php')
        addNavigationButton(newBar, 'Toplists', 'https://e-hentai.org/toplist.php')
        addNavigationButton(newBar, 'Bounties', 'https://e-hentai.org/bounty.php')
        addNavigationButton(newBar, 'News', 'https://e-hentai.org/news.php')
        addNavigationButton(newBar, 'Forums', 'https://forums.e-hentai.org/')
        addNavigationButton(newBar, 'Wiki', 'https://ehwiki.org/')
        addNavigationButton(newBar, 'HentaiVerse', 'https://hentaiverse.org/')
      } else if (windowUrl.includes('exhentai.org/upload')) {
        addNavigationButton(newBar, 'Settings', 'https://exhentai.org/uconfig.php')
        addNavigationButton(newBar, 'My Uploads', 'https://exhentai.org/upload/manage.php')
        addNavigationButton(newBar, 'My Tags', 'https://exhentai.org/mytags')
      }
      const navigationBar = document.getElementById('nb')
      navigationBar.parentNode.insertBefore(newBar, navigationBar.nextSibling)
      navigationBar.parentNode.removeChild(navigationBar)
      newBar.id = 'nb'
      newBar.style.display = 'flex'

      if (pageType === 'upload management') {
        if (windowUrl.includes('managegallery')) {
          // Refit the height of the "choose files" button in gallery upload pages, because the bottom border was too
          // low and inconsistent with other buttons of the same type, like the file search button.
          const uploadButton = document.getElementById('uploadfiles')
          if (uploadButton !== null) {
            uploadButton.style.height = 'auto'
          }
        } else {
          // The styles in document.head of the upload list are the same on both sides. There are only two effective
          // colour properties, but they only fit the light theme, so a fix is needed for the dark theme.
          if ((windowUrl.includes('e-hentai.org') && settings.applyDarkTheme.featureEnabled) ||
            (windowUrl.includes('exhentai.org') && !settings.applyLightTheme.featureEnabled)) {
            // These colours are the colour of the table header text and that of the hearder background, which are
            // consistent with the colours in the light theme.
            designFixesStyles += `
              /* fix sorting arrow colours in dark theme */
              img.s { border-color: #f1f1f1 }
              img.u { border-color: #40454b }`
          }
        }
      }
    } else if (pageType === 'EH forums') {
      // Use a relative limit instead of an absolute one to ensure images in posts will fit inside the viewport. This
      // applies to both thread view and thread-post view.
      designFixesStyles += `
        /* limit relative size of images in posts */
        .postcolor img { max-width: 100% !important; }`
    } else if (/e-hentai\.org\/gallerypopups\.php\?gid=\d+&t=[0-9a-z]+&act=expunge/.test(windowUrl)) {
      // DISABLED: The redesigned expunged log does not have PM icons so this fix is no longer needed.
      /*
      // The spacing between each pair of username and PM icon in the expunge log is inconsistent with that in gallery
      // view. "padding-left" of the PM icon is therefore increased by 18px to match the spacing in gallery view, which
      // is created by a 18.34px wide text node.
      designFixesStyles += `
        /* adjust spacing between username and PM icon *//*
        img.ygm { filter: brightness(100); padding-left: 20px; }`
      */
    } else if (windowUrl.includes('exhentai.org/tos.php')) {
      // Redirect the terms of service page in the EX upload interface, because this EX version does not exist.
      window.location.assign(windowUrl.replace('exhentai.org', 'e-hentai.org'))
    } else if (windowUrl.includes('tools.php?act=track_rename')) {
      designFixesStyles += `
        /* let submitted rename titles wrap to next line to maintain page width */
        body > div > div > div > div { white-space: unset !important; } `
    }

    if (pageType === 'gallery list' || windowUrl === 'https://e-hentai.org/bounty.php') {
      // Fix the colour of the arrow in the page number selector when it is not clickable in the dark theme. Without
      // this fix, this arrow would still use the colour from the light theme.
      if ((windowUrl.includes('e-hentai.org') && settings.applyDarkTheme.featureEnabled) ||
        (windowUrl.includes('exhentai.org') && !settings.applyLightTheme.featureEnabled)) {
        designFixesStyles += `
          /* use an appropriate colour for unclickable page number arrow */
          td.ptdd, td.ptdd:hover { color: #73767c !important; }`
      }
    }

    if (designFixesStyles.length > 0) {
      appendStyleText(document.documentElement, 'designFixesStyles', designFixesStyles)
    }
  }

  /**
   * Improves the top navigation bar in the gallery system by adding a few additional buttons.
   */
  const improveNavigationBar = function () {
    // This feature obviously cannot run when the bar is not there, and the forums and HV are screened out first.
    if (pageType === 'EH forums' || pageType === 'HentaiVerse') {
      return
    }
    const navigationBar = document.getElementById('nb')
    if (navigationBar === null) {
      return
    }

    // Use a consistent style on both sides.
    navigationBar.style.maxWidth = '1300px'
    navigationBar.style.justifyContent = 'center'
    // Allow the bar to take more than one line when needed.
    navigationBar.style.maxHeight = 'initial'

    if (windowUrl.includes('exhentai.org')) {
      addNavigationButton(navigationBar, 'Forums', 'https://forums.e-hentai.org/')
      addNavigationButton(navigationBar, 'Wiki', 'https://ehwiki.org/')
      // This does not relicate the "HentaiVerse" -> "HV" behaviour from the span elements when screen width is limited.
      addNavigationButton(navigationBar, 'HentaiVerse', 'https://hentaiverse.org/')
      if (windowUrl.includes('exhentai.org/upload')) {
        addNavigationButton(navigationBar, 'To E-Hentai', windowUrl.replace('exhentai.org/upload',
          'upload.e-hentai.org'))
      } else {
        addNavigationButton(navigationBar, 'To E-Hentai', windowUrl.replace('exhentai.org', 'e-hentai.org'))
      }
    }

    // Start to add the unread count buttons. The en dash in these buttons are as wide as a digit, so it is used to
    // prevent the width of the navigation bar from changing after these elements are updated by XHRs.
    if (!settings.improveNavigationBar.unreadCountsEnabled) {
      return
    }

    const domParser = new DOMParser()

    /**
     * Uses GET or POST to request a page via XHR, and runs the supplied function on load.
     *
     * @param {string} targetUrl - The URL to which this XHR will be sent.
     * @param {Function} onloadFunction - The function that will run on the successful response from this XHR.
     */
    function fetchUnreadCount (targetUrl, onloadFunction) {
      // The XHR will not retry on network or HTML error, because the error may persist for a while and the user
      // cannot cancel this endless retry process.
      const xhrDetails = {
        method: 'GET',
        synchronous: false,
        timeout: 60000,
        url: targetUrl,
        onload: function (response) {
          if (response.status === 200) {
            const documentReceived = domParser.parseFromString(response.responseText, 'text/html')
            onloadFunction(documentReceived)
          }
        },
        ontimeout: function (response) {
          fetchUnreadCount()
        }
      }

      const errorHandler = runtimeError => {}
      if (api.version === 'v4') {
        api.xmlHttpRequest(xhrDetails).catch(errorHandler)
      } else {
        xhrDetails.onerrror = errorHandler
        api.xmlHttpRequest(xhrDetails)
      }
    }

    /**
     * Fetches the EH forum front page to read the "* New Messages" part and update the unread PM button.
     *
     * @param {Document} documentReceived - The parsed document returned by the caller XHR.
     */
    function updateUnreadPmCount (documentReceived) {
      const unreadCountButton = xpathSelector(document, './/a[text() = "PM: –"]')
      const newMessagesButton = documentReceived.querySelector('#userlinks a[href *= "act=Msg"]')

      // Check whether this inbox link exists and hence whether the user is logged in; then update the link if
      // the user is logged in.
      if (newMessagesButton !== null) {
        const unreadPmCount = newMessagesButton.textContent.match(/\d+/)[0]
        unreadCountButton.textContent = 'PM: ' + unreadPmCount
        if (unreadPmCount > 0) {
          unreadCountButton.style.color = 'red'
        }
      }
    }

    /**
     * Fetches the MM inbox page to check for unread mails and update the unread MM button.
     *
     * @param {Document} documentReceived - The parsed document returned by the caller XHR.
     */
    function updateUnreadMmCount (documentReceived) {
      const unreadCountButton = xpathSelector(document, './/a[text() = "MM: –"]')

      if (documentReceived.getElementById('mmail_outer') === null) {
        // Do nothing because the MM inbox page was not received, likely because the user is in a battle.
      } else if (documentReceived.getElementById('mmail_nnm') !== null) {
        // Check for the "no new mail" indicator.
        unreadCountButton.textContent = 'MM: 0'
      } else {
        // Only the rows that represent actual MMs will have an onclick property.
        unreadCountButton.textContent = 'MM: ' + documentReceived.querySelectorAll('#mmail_list tr[onclick]').length
        unreadCountButton.style.color = 'red'
      }
    }

    /**
     * Fetches the karma log to check timestamps for new karma messages and update the unread +K button.
     *
     * @param {Document} documentReceived - The parsed document returned by the caller XHR.
     */
    function updateUnreadKarmaCount (documentReceived) {
      const unreadCountButton = xpathSelector(document, './/a[text() = "+K: –"]')
      const karmaTable = documentReceived.getElementsByTagName('table')[0]

      // How this page will look when the user does not have any karma message is not known, so the empty karma
      // page scenario here is tested in two ways. The value for last karma read is not recorded so the next two
      // branches below will work as intended.
      if (typeof karmaTable === 'undefined' ||
        documentReceived.querySelector('#lb + div').textContent.match(/Total Karma: (\d+)/)[1] === '0') {
        unreadCountButton.textContent = '+K: 0'
        return
      }

      // When this unread +K check is done for the first time, assume the user has read the latest karma message
      // and record this timestamp as read.
      if (values.improveNavigationBar.lastKarmaRead === '') {
        values.improveNavigationBar.lastKarmaRead = karmaTable.rows[1].firstElementChild.textContent
        api.setValue('values', JSON.stringify(values))
        unreadCountButton.textContent = '+K: 0'
      } else {
        let unreadKarmaCount = 0
        for (const row of karmaTable.rows) {
          if (row.firstElementChild.textContent !== 'Date') {
            // Compare the timestamp with that of the last recorded +K message that has been read. A date
            // comparison is not necessary since this list is always sorted in descending order.
            if (row.firstElementChild.textContent !== values.improveNavigationBar.lastKarmaRead) {
              unreadKarmaCount += 1
            } else {
              break
            }
          }
        }
        unreadCountButton.textContent = `+K: ${unreadKarmaCount}`
        if (unreadKarmaCount > 0) {
          unreadCountButton.style.color = 'red'
        }
      }
    }

    // Add a button that shows the number of unread forum PMs and links to the inbox. If the button is clicked when the
    // user is not logged in, the error page displayed will allow the user to log in.
    addNavigationButton(navigationBar, 'PM: –', 'https://forums.e-hentai.org/index.php?act=Msg&CODE=01')
    fetchUnreadCount('https://forums.e-hentai.org/', updateUnreadPmCount)

    // Add a button that shows the number of unread mooglemails and links to the MM inbox.
    addNavigationButton(navigationBar, 'MM: –', 'https://hentaiverse.org/?s=Bazaar&ss=mm')
    fetchUnreadCount('https://hentaiverse.org/?s=Bazaar&ss=mm', updateUnreadMmCount)

    // Add a button that shows the number of unread +K messages and links to the karma log. Since the karma log does not
    // offer an unread count itself, the script needs to keep track of the last message read.
    if (windowUrl === 'https://e-hentai.org/logs.php?t=karma') {
      const karmaTable = document.getElementsByTagName('table')[0]
      // How this page will look when the user does not have any karma message is not known, so the empty karma
      // page scenario here is tested in two ways like in updateUnreadKarmaCount().
      if (typeof karmaTable === 'undefined' ||
        document.querySelector('#lb + div').textContent.match(/Total Karma: (\d+)/)[1] === '0') {
        addNavigationButton(navigationBar, '+K: –', 'https://e-hentai.org/logs.php?t=karma')
      } else {
        addNavigationButton(navigationBar, '+K: 0', 'https://e-hentai.org/logs.php?t=karma')

        // Record the timestamp of the latest karma message and update the userscript storage if needed.
        const latestKarmaTimestamp = karmaTable.rows[1].firstElementChild.textContent
        if (values.improveNavigationBar.lastKarmaRead !== latestKarmaTimestamp) {
          values.improveNavigationBar.lastKarmaRead = latestKarmaTimestamp
          api.setValue('values', JSON.stringify(values))
        }
      }
    } else {
      addNavigationButton(navigationBar, '+K: –', 'https://e-hentai.org/logs.php?t=karma')
      fetchUnreadCount('https://e-hentai.org/logs.php?t=karma', updateUnreadKarmaCount)
    }
  }

  /**
   * Adds links to the main gallery maintenance threads in the vigilante subforum to the gallery information pane.
   */
  const addVigilanteLinks = function () {
    if (pageType !== 'gallery view') {
      return
    }

    /**
     * Adds a link button to the list of links on the right side of the gallery information pane.
     *
     * @param {string} text - The visible text content of the link.
     * @param {string} url - The destination URL of the link.
     * @param {string} className - The class name to be applied to this anchor element.
     */
    const addLinkItem = function (text, url, className) {
      const paragraph = document.createElement('p')
      paragraph.className = className
      const image = document.createElement('img')
      image.src = 'https://ehgt.org/g/mr.gif'
      const anchor = document.createElement('a')
      anchor.textContent = text
      anchor.href = url
      anchor.onclick = function (anchorEvent) {
        anchorEvent.preventDefault()
        window.open(url)
      }

      paragraph.appendChild(image)
      paragraph.appendChild(anchor)
      document.getElementById('gd5').appendChild(paragraph)
    }

    // max-height: 100% is needed on div#gd4 below to limit the height of the tagging area to prevent its side borders
    // from overflowing when a tag is selected.
    let vigilanteLinksStyles = `
      div#gd4 { width: 570px; max-height: 100%; }
      #tagmenu_new { width: auto !important; }
      div#gd5 { width: 160px; margin-top: -5px; }
      .gsp { padding-top: 12px; }`

    // When there is an advertisement, there will be a #spa element between #gd3 and #gd4 that can take at least 600 x
    // 60px space. The "report gallery" link is also too close to the advertisement, and the fix below is a design fix.
    if (document.getElementById('spa') !== null) {
      vigilanteLinksStyles += `
      .g2, .g3 { padding-bottom: 6px; }
      .g3 { padding-top: 6px }`
    } else {
      vigilanteLinksStyles += `
      .g2, .g3 { padding-bottom: 8px; }`
    }

    // The colour of the forum links is calculated by blending the background colour of div#gright and the colour of
    // sibling anchors in the ratio of 1:1.
    if ((windowUrl.includes('e-hentai.org') && settings.applyDarkTheme.featureEnabled) ||
      (windowUrl.includes('exhentai.org') && !settings.applyLightTheme.featureEnabled)) {
      vigilanteLinksStyles += `
      .g2.forum > a { color: #96989C; }`
    } else {
      vigilanteLinksStyles += `
      .g2.forum > a { color: #A57C78; }`
    }
    appendStyleText(document.head, 'vigilanteLinksStyles', vigilanteLinksStyles)

    // These links are ordered by thread size.
    addLinkItem(' Tagging Assistance', 'https://forums.e-hentai.org/index.php?showtopic=184081', 'g2 forum gsp')
    addLinkItem(' Tag Namespacing', 'https://forums.e-hentai.org/index.php?showtopic=199295', 'g2 forum')
    addLinkItem(' Renaming & Reclassing', 'https://forums.e-hentai.org/index.php?showtopic=227712', 'g2 forum')
    addLinkItem(' Expunge Assistance', 'https://forums.e-hentai.org/index.php?showtopic=242797', 'g2 forum')
    addLinkItem(' Comment Cleanup', 'https://forums.e-hentai.org/index.php?showtopic=217762', 'g2 forum')
  }

  /**
   * Shows a more objective alternative rating system inside galleries, which is based on the ratio of favorited/rated.
   *
   * The ratio rating equals the ratio of times favorited to times rated, and a descriptive rating based on this ratio
   * is also provided. The ratio rating should be a better quality measure than the star rating and the difference
   * between them can be very significant, because the former is much less polarised, more distinct, and somewhat immune
   * to excessive downvoting.
   */
  const showAlternativeRating = function () {
    if (pageType !== 'gallery view') {
      return
    }

    // This constant specifies the distribution of descriptive ratings derived from ratios. In each ratio-description
    // pair below, the description will be used for the descriptive rating when the gallery's calculated ratio is equal
    // to or greater than the ratio.
    const ratioLevels = [
      { ratio: 10, description: 'masterwork' },
      { ratio: 7, description: 'excellent' },
      { ratio: 4, description: 'good' },
      { ratio: 1, description: 'average' },
      { ratio: 0, description: 'unpopular' }
    ]

    /**
     * Appends a two-cell row to the information table on the left side of the gallery information pane.
     *
     * @param {string} leftCellText - The text to be shown in the left cell of this new row.
     * @param {string} rightCellText - The text to be shown in the right cell of this new row.
     */
    const addTableRow = function (leftCellText, rightCellText) {
      const informationTable = document.getElementById('gdd').firstElementChild.firstElementChild
      const newRow = informationTable.insertRow(-1)
      const leftCell = newRow.insertCell()
      leftCell.className = 'gdt1'
      leftCell.textContent = leftCellText
      const rightCell = newRow.insertCell()
      rightCell.className = 'gdt2'
      rightCell.textContent = rightCellText
    }

    const timesFavorited = +document.getElementById('favcount').textContent.replace(/\D/g, '')
    const timesRated = +document.getElementById('rating_count').textContent

    if (settings.showAlternativeRating.hideStarsEnabled) {
      document.getElementById('gdr').style.display = 'none'
      document.getElementById('gdf').style.paddingTop = '0'
      // When the star rating section is hidden, a row will be added to the table to show this rating for comparison.
      if (timesRated !== 0) {
        const starRating = +document.getElementById('rating_label').textContent.replace('Average: ', '')
        if (isNaN(starRating)) {
          // It is possible for starRating to be NaN, but it cannot be reproduced and how it happened is still unknown.
          addTableRow('Rating:', 'N/A')
        } else {
          addTableRow('Rating:', starRating + (starRating <= 1 ? ' star' : ' stars'))
        }
      } else {
        addTableRow('Rating:', 'Not yet rated')
      }
    } else {
      document.getElementById('gdr').style.marginTop = '15px'
      document.getElementById('gdf').style.paddingTop = '15px'
    }

    // Add a row to the table to show the ratio of times favorited to times rated, and the derived descriptive rating.
    if (timesRated >= 20) {
      // The ratio will be rounded down to one decimal place.
      const ratio = Math.floor((timesFavorited / timesRated) * 10) / 10
      // Go through the thresholds in descending order and use the floor for this gallery's descriptive rating.
      ratioLevels.push({ ratio: ratio, description: 'this gallery' })
      ratioLevels.sort((a, b) => a.ratio - b.ratio)
      let i = ratioLevels.length

      // The gallery's ratio must be greater than zero, so the loop does not need to check whether it is the last,
      // smallest value in the array.
      while (--i) {
        if (ratioLevels[i].description === 'this gallery') {
          let description
          // Check for the case where the ratio is equal to a threshold and placed just before this threshold in the
          // array. The symmetrical case where it is placed just after this threshold is included in the else branch.
          if (typeof ratioLevels[i + 1] !== 'undefined' && ratioLevels[i].ratio === ratioLevels[i + 1].ratio) {
            description = ratioLevels[i + 1].description
          } else {
            description = ratioLevels[i - 1].description
          }
          addTableRow('Fav/Rate:', `${ratio} (${description})`)
        }
      }
    } else {
      // Do not show the ratio when there are not enough star ratings and hence gallery visits to calculate reliable
      // results. Using 20 as the threshold here provides a good balance between availability and reliability.
      addTableRow('Fav/Rate:', 'Not enough data')
    }
  }

  /**
   * Adds links to gallery upload guides to the upload management bar.
   */
  const addGuideLinks = function () {
    if (pageType !== 'upload management') {
      return
    }

    const managementBar = document.getElementById('lb')
    let guideLinkColour

    // The colour of the guide links is calculated by blending the background colour of body and the colour of
    // sibling anchors in the ratio of 1:1.
    if ((windowUrl.includes('e-hentai.org') && settings.applyDarkTheme.featureEnabled) ||
      (windowUrl.includes('exhentai.org') && !settings.applyLightTheme.featureEnabled)) {
      guideLinkColour = '#89898C'
    } else {
      guideLinkColour = '#A07771'
    }

    /**
     * Adds a anchor element to the upload management bar as a child node in the same style as its siblings.
     *
     * @param {string} text - The visible text content of the anchor element, excluding the enclosing square brackets.
     * @param {string} url - The destination URL of the anchor element.
     */
    const addGuideAnchor = function (text, url) {
      managementBar.appendChild(document.createTextNode('\u00A0\u00A0\u00A0'))
      const anchor = document.createElement('a')
      // Unlike its sibling anchors, the square brackets are included in this anchor to change their colour as well.
      anchor.textContent = `[${text}]`
      anchor.href = url
      anchor.style.color = guideLinkColour
      anchor.onclick = function (anchorEvent) {
        anchorEvent.preventDefault()
        window.open(url)
      }
      managementBar.appendChild(anchor)
    }

    managementBar.lastChild.nodeValue = ']'
    addGuideAnchor('Upload Guide', 'https://ehwiki.org/wiki/Making_Galleries')
    addGuideAnchor('Category Guide', 'https://ehwiki.org/wiki/Gallery_Categories#Flow_Chart')
    addGuideAnchor('Naming Guide', 'https://ehwiki.org/wiki/Renaming#Naming_Style')
    addGuideAnchor('Tagging Guide', 'https://ehwiki.org/wiki/Gallery_Tagging')
    addGuideAnchor('Upload FAQ', 'https://ehwiki.org/wiki/E-Hentai_Galleries_FAQ#Uploading')
    addGuideAnchor('Upload Troubleshooting', 'https://ehwiki.org/wiki/Technical_Issues#Your_Galleries')
  }

  /**
   * Applies subjective style fixes to make some elements look better and more consistent in general.
   */
  const applySubjectiveFixes = function () {
    let subjectiveFixesStyles = ''

    if (pageType !== 'EH forums' && pageType !== 'HentaiVerse') {
      // Adjust the input elements everywhere.
      subjectiveFixesStyles += `
        /* use consistent 1px border */
        input[type = "button"], input[type = "submit"] { border-width: 1px; }
        /* vertically center the text in input elements */
        input[type = "text"], input[type = "password"], select, textarea { padding: 2px 3px; }`

      // The vertical spacing above the links at the very bottom, such as "terms of service", is inconsistent across
      // page types and often too small. A consistent spacing of 5px is used above these links.
      subjectiveFixesStyles += `
        /* gallery list, torrent list and bounty view */
        div.ido + div.dp, div.ido + script + div.dp, form#form_bounty + script + div.dp { margin-top: 0 !important; }
        /* gallery view already has the right margin */
        /* image view */
        div#i1 + script + script + div.dp {
          margin-top: ${settings.fitViewerToScreen.featureEnabled ? '5px' : '-1px'} !important; }
        /* news */
        div#newsouter + div.dp { margin-top: 5px !important; }`

      // The margins around .stuffbox are inconsistent across pages under "my home".
      if (windowUrl.includes('uconfig.php') || windowUrl.includes('mytags')) {
        subjectiveFixesStyles += `
          #outer.stuffbox { margin: 10px auto; }`
      }

      // Slightly adjust the placement of elements in the thumbnail gallery list display mode for better symmetry.
      if (displayMode === 'thumbnail') {
        subjectiveFixesStyles += `
          .gl3t, .gl4t { margin-bottom: 3px; }
          .gl6t { padding-top: 3px; padding-bottom: 1px; }`
      }
    }

    if (pageType === 'gallery view') {
      // Realign and fix inconsistent tag input and button. This is partially caused by the input element fix above.
      subjectiveFixesStyles += `
        #newtagfield { line-height: 20px; }
        #newtagbutton { width: 100px; max-width: calc(570px - 10px - 4px - 480px - 2px - 2px - 2px);
          font-size: 10pt; padding: 2px 3px; }`
    } else if (pageType === 'EH forums') {
      // Tick the two checkboxes for new forum PMs to add sent PMs to sent items and track these messages by default.
      if (/forums\.e-hentai\.org\/index\.php\?(?:act=Msg(?:&CODE=0?4)?|CODE=0?4&act=Msg)/.test(windowUrl)) {
        // URL is https://forums.e-hentai.org/index.php?act=msg when there is an error sending PM.
        document.getElementsByName('add_sent')[0].checked = true
        document.getElementsByName('add_tracking')[0].checked = true
      }

      const newMessagesButton = document.querySelector('#userlinks a[href *= "act=Msg"]')
      if (typeof newMessagesButton !== 'undefined') {
        const unreadPmCount = newMessagesButton.textContent.match(/\d+/)[0]
        if (unreadPmCount > 0) {
          newMessagesButton.style.color = 'red'
        }
      }
    }

    if (subjectiveFixesStyles.length > 0) {
      appendStyleText(document.documentElement, 'subjectiveFixesStyles', subjectiveFixesStyles)
    }
  }

  /**
   * Unselects all category filter buttons in the search box by default unless they have been set after a search.
   *
   * This way it is easier to select one or two categories. It may not be a good idea to use this if the
   * user is using the front page setting in EH gallery settings, which allows the user to unselect some but not all
   * categories and also changes the galleries to be displayed by default.
   *
   * Note that this function only unselects the buttons and does not affect the galleries displayed unless the user
   * clicks the "apply filter" button to conduct a search. This is different from the front page setting.
   */
  const emptyCategoryFilter = function () {
    // This function only runs on gallery lists that has a search box with unset category buttons. Whether or not the
    // buttons have been set after a search can be determined from the URL:
    // 1. When a search involving the category filter has been conducted, the URL would contain "f_cats" with values
    //    other than 0 and 1023.
    // 2. when the user directly enters a particular category after clicking a category button for a gallery in gallery
    //    list or gallery view, the URL would have the name of the category.
    if (pageType !== 'gallery list') {
      return
    } else if (document.getElementById('searchbox') === null) {
      return
    } else if (/f_cats|doujinshi|manga|artistcg|gamecg|western|non-h|imageset|cosplay|asianporn|misc/.test(windowUrl)) {
      // Check for the "f_cats=0" and "f_cats=1023" cases where all category buttons were manually selected or
      // unselected by the user in a search. In these cases the category buttons are unset so this function can run.
      // Otherwise, if "f_cats" has another number, the buttons are already set and this function should not run,
      // because the category selection should not be changed.
      if (!/f_cats=(0|1023)/.test(windowUrl)) {
        return
      }
    }

    // Unselect all categories which have not been unselected yet.
    let i = 10
    while (i--) {
      const categoryButton = document.getElementById(`cat_${1 << i}`)
      if (!categoryButton.hasAttribute('data-disabled')) {
        categoryButton.click()
      }
    }
  }

  /**
   * Adjusts the height of each row in the thumbnail gallery list display mode to show full gallery titles.
   */
  const fitThumbnailTitles = function () {
    if (displayMode !== 'thumbnail') {
      return
    }

    // Fit the titles at first by increasing title heights to display up to 10 lines, which should allow all titles to
    // be displayed in full. The line height is 16px in the title elements.
    const thumbnailTitleStyles = `
      .gl4t { max-height: 160px; }`
    appendStyleText(document.head, 'thumbnailTitleStyles', thumbnailTitleStyles)

    // Set the height of each title to the height of the tallest title in its row to create margin between shorter
    // titles and their thumbnails, so that all thumbnails will stay aligned in each row.
    const titles = document.getElementsByClassName('glname')
    const titleOffsetHeights = Array.from(titles, title => title.offsetHeight)
    let i = 0
    while (i < titleOffsetHeights.length) {
      const rowMaxHeight = Math.max(...titleOffsetHeights.slice(i, i + 5))
      const rowEndIndex = Math.min(i + 5, titleOffsetHeights.length) - 1
      do {
        if (titleOffsetHeights[i] < rowMaxHeight) {
          titles[i].style.height = `${rowMaxHeight}px`
        }
      } while (++i <= rowEndIndex)
    }
  }

  /**
   * Applies colour coding to new and expunged galleries on all types of gallery lists, except for gallery toplists.
   *
   * This feature will colour the titles and timestamps of new galleries blue and those of expunged galleries red to
   * make them easier to spot. The titles of new galleries will also be made bold for further enhancement and
   * consistency with the timestamps.
   */
  const colourCodeGalleries = function () {
    // This feature runs on gallery lists but not gallery toplists, because the elements there differ from other types
    // of gallery lists and gallery statuses are not shown besides the expunged timestamp.
    if (pageType !== 'gallery list' || windowUrl.includes('toplist.php')) {
      return
    }

    const colourCodingStyles = `
      .glnew, tr[data-new] .glink, div[data-new] .glink { color: #22A7F0; font-weight: bold; }
      div[id ^= "posted_"] > s, tr[data-expunged] .glink, div[data-expunged] .glink { color: #D91E18; }`
    appendStyleText(document.head, 'colourCodingStyles', colourCodingStyles)
  }

  /**
   * Fits images to screen instead of width in the basic image viewer and adds a button to temporarily toggle the fit.
   */
  const fitViewerToScreen = function () {
    if (pageType !== 'image view') {
      return
    }

    let fitImageStyles = `
      /* stretch to fill screen */
      #i1 { height: calc(100vh - 10px); width: 95vw !important; max-width: 95vw !important; padding: 0; }
      #i3, #i3 > a > img { height: 100% !important; width: 100% !important; margin: 0; }
      /* maintain aspect ratio and fit to screen */
      #i3 > a > img { object-fit: contain; max-width: initial !important; max-height: initial !important; }
      /* reposition elements */
      #topControlGroup, #bottomControlGroup { display: flex; justify-content: center; }
      #topControlGroup > h1, #i2, #i4, #i5, #i6, #i7 { position: absolute; }
      #topControlGroup > h1, div.if { margin: 0; }
      #topControlGroup > h1 { width: 90vw; top: 0; padding-top: 10px; white-space: nowrap; overflow: hidden; }
      #i2 { top: 0; padding-top: 35px; }
      #i7 { bottom: 0; padding-bottom: 20px; }
      #i6 { bottom: 0; padding-bottom: 40px; }
      #i5 { bottom: 0; padding-bottom: 55px; }
      #i4 { bottom: 0; padding-bottom: 80px; }
      div.sni { position: initial; }
      p.ip { display: none; }
      /* add hover animation and shadow */
      #topControlGroup, #bottomControlGroup { opacity: 0; transition-duration: 0.3s; }
      #topControlGroup:hover, #bottomControlGroup:hover { opacity: 1; }
      #topControlGroup > h1, #i2, #i4, #i5, #i6, #i7
        { text-shadow: 0 1px 3px #000000, 1px 0 3px #000000, 0 -1px 3px #000000, -1px 0 3px #000000; }
      #topControlGroup, #bottomControlGroup, #i6 > a, #i7 > a { color: #f1f1f1 }
      div.sn img, div.sb img { filter: drop-shadow(0px 0px 3px #FFFFFF); }
      /* add additional shading on top and bottom */
      div.sni { display: flex; position: relative; justify-content: center; }
      #topControlGroup, #bottomControlGroup { width: calc(95vw + 2px) ; position: absolute;
        background: rgba(0, 0, 0, 0.6); }
      #topControlGroup { height: 91px; top: 0; }
      #bottomControlGroup { height: 136px; bottom: -1px; }
      #toggleButtonHost { position: absolute; }`
    const persistentStyles = `
      div.sni { margin: 2px auto; }
      /* button styles */
      #toggleButtonHost { display: flex; justify-content: center; }
      #toggleFitButton { width: 155px; min-height: 25px; height: 25px; position: fixed; bottom: 2vh;
        opacity: 0; box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.6); transition-duration: 0.3s; }
      #toggleFitButton:hover { opacity: 1; }`
    fitImageStyles += persistentStyles
    const fitImageStylesElement = appendStyleText(document.head, 'fitImageStyles', fitImageStyles)

    // The control elements originally above and below images are grouped under two divisions to re-style them and
    // enable the visibility change on hover.
    const topControlGroup = document.createElement('div')
    topControlGroup.id = 'topControlGroup'
    topControlGroup.appendChild(document.body.querySelector('#i1 > h1'))
    topControlGroup.appendChild(document.getElementById('i2'))
    document.getElementById('i1').insertBefore(topControlGroup, document.getElementById('i3'))

    const bottomControlGroup = document.createElement('div')
    bottomControlGroup.id = 'bottomControlGroup'
    bottomControlGroup.appendChild(document.getElementById('i4'))
    bottomControlGroup.appendChild(document.getElementById('i5'))
    bottomControlGroup.appendChild(document.getElementById('i6'))
    bottomControlGroup.appendChild(document.getElementById('i7'))
    document.getElementById('i1').appendChild(bottomControlGroup)

    /**
     * Temporarily toggles fit to screen or width without affect the setting in the userscript storage.
     *
     * The effect of this toggle persists between pages due to the way images are loaded in the basic viewer.
     *
     * @type {clickEventHandler}
     * @param {MouseEvent} clickEvent - The event object passed to this event handler on click.
     */
    const toggleImageFit = function (clickEvent) {
      const toggleButton = clickEvent.target
      if (toggleButton.value === 'Fit Images to Width') {
        // The original format is completely restored, since the hover control buttons are not very convenient.
        fitImageStylesElement.textContent = persistentStyles
        toggleButton.value = 'Fit Images to Screen'
      } else {
        fitImageStylesElement.textContent = fitImageStyles
        toggleButton.value = 'Fit Images to Width'
      }
    }

    const toggleButton = createDmsButton('toggleFitButton', 'Fit Images to Width', toggleImageFit)
    const toggleButtonHost = document.createElement('div')
    toggleButtonHost.id = 'toggleButtonHost'
    toggleButtonHost.appendChild(toggleButton)
    document.getElementById('i1').appendChild(toggleButtonHost)
  }

  /**
   * Fits images to screen instead of width in the MPV and adds a button to temporarily toggle the fit.
   */
  const fitMpvToScreen = function () {
    if (pageType !== 'MPV view') {
      return
    }

    const shortcuts = settings.fitMpvToScreen
    let fitMpvStyles
    // Sometimes the image information below each image can be longer than the image in the MPS mode, and there is not a
    // way to always crop and fit it accurately between the buttons using CSS. Therefore, to show the text, the five
    // buttons below each image will be hidden by default and revealed when the pointer is hovering over the whole bar.
    // This way the buttons are always available and the full information should be displayed most of the time;
    // otherwise, when the text is too long, it will be truncated and suffixed with ellipsis at the end.
    if (shortcuts.mpsModeEnabled) {
      fitMpvStyles = `
        /* stretch to fill screen */
        div.mi0, img[id ^= "imgsrc_"] { height: calc(100vh - 2px) !important; width: auto !important; }
        /* maintain aspect ratio and fit to screen */
        img[id ^= "imgsrc_"] { object-fit: contain; max-width: 100%; }
        /* remove default width limit and reposition the text and buttons below the image */
        div.mi0 { display: inline-table; min-width: 0; max-width: 100% !important; }
        div.mi1 { display: flex; justify-content: center; height: 20px; padding: 5px 0 3px 0; }
        div.mi2, div.mi3 { position: absolute; float: unset; opacity: 0; transition-duration: 0.3s; }
        div.mi1:hover > div.mi2, div.mi1:hover > div.mi3 { opacity: 1; }
        div.mi2 { left: 0; }
        div.mi3 { right: 0; }
        div.mi4 { max-width: calc(100% - 10px); top: unset; left: unset; white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; }`
    } else {
      fitMpvStyles = `
        /* stretch to fill screen */
        div.mi0, img[id ^= "imgsrc_"] { height: calc(100vh - 2px) !important; width: 100% !important; }
        /* maintain aspect ratio and fit to screen */
        img[id ^= "imgsrc_"] { object-fit: contain; }
        /* remove default width limit and reposition the text and buttons below the image */
        div.mi0 { max-width: 100% !important; ${shortcuts.seamlessModeEnabled ? '' : 'padding-bottom: 30px; '}}
        div.mi1 { padding: 5px 0 3px 0; }
        div.mi4 { width: 60vw; position: initial; top: 5px; margin: 0 auto; white-space: nowrap; overflow: hidden; }`
    }
    let persistentStyles = `
      /* remove top and bottom borders inside the image pane */
      body { padding: 0px 2px; }
      #pane_images { height: 100vh !important; }
      /* button styles */
      #toggleButtonHost { display: flex; justify-content: center; }
      #toggleFitButton { width: 155px; min-height: 25px; height: 25px; position: fixed; bottom: 2vh;
        opacity: 0; box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.6); transition-duration: 0.3s; }
      #toggleFitButton:hover { opacity: 1; }`
    if (shortcuts.seamlessModeEnabled) {
      persistentStyles += `
        /* hide the information and buttons below each image */
        div.mi1 { display: none; }`
    }
    fitMpvStyles += persistentStyles
    if (shortcuts.seamlessModeEnabled) {
      // This property is now included in "persistentStyles" but not in "fitMpvStyles" so as to avoid repetition.
      persistentStyles += `
        div.mi0 { height: auto !important; }`
    }

    /**
     * Temporarily toggles fit to screen or width without affect the setting in the userscript storage.
     *
     * @type {clickEventHandler}
     * @param {MouseEvent} clickEvent - The event object passed to this event handler on click.
     */
    const toggleMpvFit = function (clickEvent) {
      const toggleButton = clickEvent.target
      if (toggleButton.value === 'Fit Images to Width') {
        // The border rules are kept to keep the view consistent.
        document.getElementById('fitMpvStyles').textContent = persistentStyles
        toggleButton.value = 'Fit Images to Screen'
      } else {
        document.getElementById('fitMpvStyles').textContent = fitMpvStyles
        toggleButton.value = 'Fit Images to Width'
      }
    }

    let toggleButton
    if (shortcuts.makeDefaultEnabled) {
      appendStyleText(document.head, 'fitMpvStyles', fitMpvStyles)
      toggleButton = createDmsButton('toggleFitButton', 'Fit Images to Width', toggleMpvFit)
    } else {
      appendStyleText(document.head, 'fitMpvStyles', persistentStyles)
      toggleButton = createDmsButton('toggleFitButton', 'Fit Images to Screen', toggleMpvFit)
    }
    const toggleButtonHost = document.createElement('div')
    toggleButtonHost.id = 'toggleButtonHost'
    toggleButtonHost.appendChild(toggleButton)
    document.getElementById('pane_images').appendChild(toggleButtonHost)
  }

  /**
   * Adds a user-friendly control panel for this script to gallery lists, which also keeps the settings between updates.
   */
  const addControlPanel = function () {
    if (pageType !== 'gallery list') {
      return
    }

    const galleryList = document.getElementsByClassName('itg')[0]

    /**
     * Adds the "open", "save" and "cancel" buttons for using the control panel.
     */
    const addConfigButtons = function () {
      // Move up the display order options in the favorite list so that they are not blocked from view by these buttons.
      if (windowUrl.includes('favorites.php')) {
        const displayOrderOption = document.body.querySelector('a[href *= "inline_set=fs_"]')
        displayOrderOption.parentNode.parentNode.style.top = '-29.5px'
      }

      const openConfigButton = createDmsButton('openConfigButton', 'Configure Master Script', openControlPanel,
        'Temporarily hide the gallery list and open the control panel')
      const saveConfigButton = createDmsButton('saveConfigButton', 'Save', function () {
        if (saveSettings()) {
          closeControlPanel()
          alert('Settings saved. Please reload the page to let your browser reload the script. Other open EH pages ' +
            'will need to be reloaded as well to apply any changes you have made.')
        }
      }, 'Save the settings and close the control panel')
      const cancelConfigButton = createDmsButton('cancelConfigButton', 'Cancel', closeControlPanel, 'Close the ' +
        'control panel without saving any changes')
      openConfigButton.style.display = 'block'
      saveConfigButton.style.display = 'none'
      cancelConfigButton.style.display = 'none'

      const configButtonHost = document.createElement('div')
      configButtonHost.id = 'configButtonHost'
      configButtonHost.appendChild(openConfigButton)
      configButtonHost.appendChild(saveConfigButton)
      configButtonHost.appendChild(cancelConfigButton)
      document.getElementById('dms').appendChild(configButtonHost)
    }

    /**
     * Creates the control panel on demand and alters the gallery list to display it.
     */
    const openControlPanel = function () {
      const controlPanel = createControlPanel()
      galleryList.parentNode.insertBefore(controlPanel, galleryList)
      galleryList.style.display = 'none'
      controlPanel.style.display = 'block'
      document.getElementById('openConfigButton').style.display = 'none'
      document.getElementById('saveConfigButton').style.display = 'block'
      document.getElementById('cancelConfigButton').style.display = 'block'
    }

    /**
     * Helps openControlPanel() to actually create the control panel using a table and fill in the rows.
     *
     * This is the only place in this script where features are grouped by applicable page type instead of load order.
     */
    const createControlPanel = function () {
      const controlPanel = document.createElement('table')
      controlPanel.id = 'controlPanel'
      controlPanel.className = 'itg'

      // The spaces around "•" below are em quad characters.
      const scriptInfoRow = extendWithAnchor(appendRow(controlPanel, 0), undefined, `${api.info.script.name} ` +
        `v${api.info.script.version}`, 'https://openuserjs.org/scripts/Mayriad/Mayriads_EH_Master_Script', true)
      scriptInfoRow.appendChild(document.createTextNode(' • '))
      extendWithAnchor(scriptInfoRow, undefined, 'GitHub Repository',
        'https://github.com/Mayriad/Mayriads-EH-Master-Script', true)
      scriptInfoRow.appendChild(document.createTextNode(' • '))
      extendWithAnchor(scriptInfoRow, undefined, 'User Manual',
        'https://github.com/Mayriad/Mayriads-EH-Master-Script/blob/master/README.md', true)
      scriptInfoRow.appendChild(document.createTextNode(' • '))
      extendWithAnchor(scriptInfoRow, undefined, 'Support Thread - Ask me if you need help!',
        'https://forums.e-hentai.org/index.php?showtopic=233955', true)

      // Sitewide features ---------------------------------------------------------------------------------------------

      controlPanel.insertRow(-1)
      extendWithStrongText(appendRow(controlPanel, 0), undefined, 'Site-wide features')

      // applyDarkTheme

      extendWithCheckBox(appendRow(controlPanel, 0), 'applyDarkTheme-featureEnabled',
        settings.applyDarkTheme.featureEnabled, 'Apply a full, scientific dark theme to the gallery system where ' +
        'applicable')

      // applyLightTheme

      extendWithCheckBox(appendRow(controlPanel, 0), 'applyLightTheme-featureEnabled',
        settings.applyLightTheme.featureEnabled, 'Apply a full, scientific light theme to the gallery system where ' +
        'applicable')

      // applyDesignFixes

      extendWithCheckBox(appendRow(controlPanel, 0), 'applyDesignFixes-featureEnabled',
        settings.applyDesignFixes.featureEnabled, 'Fix website design problems throughout the gallery system')

      // applySubjectiveFixes

      extendWithCheckBox(appendRow(controlPanel, 0), 'applySubjectiveFixes-featureEnabled',
        settings.applySubjectiveFixes.featureEnabled, 'Apply subjective style fixes to make some elements look ' +
        'better and more consistent in the gallery system')

      // improveNavigationBar

      extendWithCheckBox(appendRow(controlPanel, 0), 'improveNavigationBar-featureEnabled',
        settings.improveNavigationBar.featureEnabled, 'Improve the top navigation bar in the gallery system by ' +
        'adding a few additional buttons (one option below)')

      extendWithCheckBox(appendRow(controlPanel, 1), 'improveNavigationBar-unreadCountsEnabled',
        settings.improveNavigationBar.unreadCountsEnabled, 'Show the numbers of unread forum PMs, HV MMs and +K ' +
        'messages when you are logged in')

      // applyTextFilters
      // A limit is not really needed, but the total length of every text input under this feature is limited to 255
      // characters, which would at least prevent performance degradation if it actually matters.

      extendWithCheckBox(appendRow(controlPanel, 0), 'applyTextFilters-featureEnabled',
        settings.applyTextFilters.featureEnabled, 'Apply user and word filters to selectively remove gallery ' +
        'comments, forum posts and forum threads (a few options below)')

      const commentatorFilterEnabledRow = extendWithCheckBox(appendRow(controlPanel, 1),
        'applyTextFilters-commentatorFilterEnabled', settings.applyTextFilters.commentatorFilterEnabled,
        'Hide gallery comments made by the following users:')
      extendWithTextInput(commentatorFilterEnabledRow, 'applyTextFilters-commentatorFilterUsernames',
        joinPotentialArray(settings.applyTextFilters.commentatorFilterUsernames), 255, '(separate usernames by ' +
        'comma)', 'Enter up to 255 characters, case sensitive')

      const commentFilterEnabledRow = extendWithCheckBox(appendRow(controlPanel, 1),
        'applyTextFilters-commentFilterEnabled', settings.applyTextFilters.commentFilterEnabled,
        'Hide gallery comments that contain any of the following keywords:')
      extendWithTextInput(commentFilterEnabledRow, 'applyTextFilters-commentFilterKeywords',
        joinPotentialArray(settings.applyTextFilters.commentFilterKeywords), 255, '(separate keywords and/or ' +
        'phrases by comma)', 'Enter up to 255 characters, case insensitive')

      const posterFilterEnabledRow = extendWithCheckBox(appendRow(controlPanel, 1),
        'applyTextFilters-posterFilterEnabled', settings.applyTextFilters.posterFilterEnabled, 'Hide')
      extendWithOptionSelector(posterFilterEnabledRow, 'applyTextFilters-posterFilterType',
        settings.applyTextFilters.posterFilterType, options.applyTextFilters.posterFilterType, 'made by the ' +
        'following users:')
      extendWithTextInput(posterFilterEnabledRow, 'applyTextFilters-posterFilterUsernames',
        joinPotentialArray(settings.applyTextFilters.posterFilterUsernames), 255, '(separate usernames by comma)',
        'Enter up to 255 characters, case sensitive')

      const postFilterEnabledRow = extendWithCheckBox(appendRow(controlPanel, 1),
        'applyTextFilters-postFilterEnabled', settings.applyTextFilters.postFilterEnabled, 'Hide')
      extendWithOptionSelector(postFilterEnabledRow, 'applyTextFilters-postFilterType',
        settings.applyTextFilters.postFilterType, options.applyTextFilters.postFilterType, 'that contain any ' +
        'of the following keywords:')
      extendWithTextInput(postFilterEnabledRow, 'applyTextFilters-postFilterKeywords',
        joinPotentialArray(settings.applyTextFilters.postFilterKeywords), 255, '(separate keywords and/or phrases ' +
        'by comma)', 'Enter up to 255 characters, case insensitive')

      extendWithCheckBox(appendRow(controlPanel, 1), 'applyTextFilters-spamFilterEnabled',
        settings.applyTextFilters.spamFilterEnabled, 'Hide spam comments, posts and threads in galleries and ' +
        'forums using the built-in spam definition (usually not needed)')

      // addJumpButtons

      const addJumpButtonsEnabledRow = extendWithCheckBox(appendRow(controlPanel, 0), 'addJumpButtons-featureEnabled',
        settings.addJumpButtons.featureEnabled, 'Add')
      extendWithOptionSelector(addJumpButtonsEnabledRow, 'addJumpButtons-jumpButtonStyle',
        settings.addJumpButtons.jumpButtonStyle, options.addJumpButtons.jumpButtonStyle, 'to the bottom right corner ' +
        'which will')
      extendWithOptionSelector(addJumpButtonsEnabledRow, 'addJumpButtons-jumpBehaviourStyle',
        settings.addJumpButtons.jumpBehaviourStyle, options.addJumpButtons.jumpBehaviourStyle, 'scroll the page to ' +
        'the very top or bottom')

      // collectDawnReward

      extendWithCheckBox(appendRow(controlPanel, 0), 'collectDawnReward-featureEnabled',
        settings.collectDawnReward.featureEnabled, 'Extends the availability of the daily dawn reward event so that ' +
        'it can be collected from any EH-related page')

      // Gallery list features -----------------------------------------------------------------------------------------

      controlPanel.insertRow(-1)
      extendWithStrongText(appendRow(controlPanel, 0), undefined, 'Gallery list features')

      // applyAdditionalFilters

      extendWithCheckBox(appendRow(controlPanel, 0), 'applyAdditionalFilters-featureEnabled',
        settings.applyAdditionalFilters.featureEnabled, 'Apply additional third-stage gallery list filters to all ' +
        'types of gallery lists, except for gallery toplists (a few options below)')

      // It is expected that, at most, each value will take 3 characters and they will be separated by 2 characters,
      // which means a length limit of 48 characters should be imposed.
      const ratedFilterEnabledRow = extendWithCheckBox(appendRow(controlPanel, 1),
        'applyAdditionalFilters-ratedFilterEnabled', settings.applyAdditionalFilters.ratedFilterEnabled,
        'Hide the galleries that you have rated at')
      extendWithTextInput(ratedFilterEnabledRow, 'applyAdditionalFilters-ratedFilterStars',
        joinPotentialArray(settings.applyAdditionalFilters.ratedFilterStars), 48, 'stars in the past, including ' +
        'their updates (separate numbers by comma, or enter "all" to hide all rated galleries)', 'Enter up to 48 ' +
        'characters, case insensitive')

      const ratedFilterExceptionEnabledRow = extendWithCheckBox(appendRow(controlPanel, 2),
        'applyAdditionalFilters-ratedFilterExceptionEnabled',
        settings.applyAdditionalFilters.ratedFilterExceptionEnabled, 'Always temporarily disable this rated gallery ' +
        'filter on')
      extendWithOptionSelector(ratedFilterExceptionEnabledRow, 'applyAdditionalFilters-ratedFilterExceptions',
        settings.applyAdditionalFilters.ratedFilterExceptions, options.applyAdditionalFilters.ratedFilterExceptions)

      // The site limits the name of each favorite category to 20 characters and they are expected to be separated by 2
      // characters at most, which means a length limit of 218 characters should be imposed.
      const favoritedFilterEnabledRow = extendWithCheckBox(appendRow(controlPanel, 1),
        'applyAdditionalFilters-favoritedFilterEnabled', settings.applyAdditionalFilters.favoritedFilterEnabled,
        'Hide the galleries that you have added to the favorite categories of')
      extendWithTextInput(favoritedFilterEnabledRow, 'applyAdditionalFilters-favoritedFilterCategories',
        joinPotentialArray(settings.applyAdditionalFilters.favoritedFilterCategories), 218, ', including their ' +
        'updates (separate categories by comma, or enter "all" to hide all categories)', 'Enter up to 218 ' +
        'characters, case insensitive')

      extendWithCheckBox(appendRow(controlPanel, 2), 'applyAdditionalFilters-favoritedFilterExceptionEnabled',
        settings.applyAdditionalFilters.favoritedFilterExceptionEnabled, 'Always temporarily disable this favorited ' +
        'gallery filter on the popular list')

      // A limit is not really needed, but the total length of the input is limited to 255 characters for consistency.
      const titleFilterEnabledRow = extendWithCheckBox(appendRow(controlPanel, 1),
        'applyAdditionalFilters-titleFilterEnabled', settings.applyAdditionalFilters.titleFilterEnabled,
        'Hide all galleries whose title has at least')
      extendWithOptionSelector(titleFilterEnabledRow, 'applyAdditionalFilters-titleFilterType',
        settings.applyAdditionalFilters.titleFilterType, options.applyAdditionalFilters.titleFilterType, 'of')
      extendWithTextInput(titleFilterEnabledRow, 'applyAdditionalFilters-titleFilterKeywords',
        joinPotentialArray(settings.applyAdditionalFilters.titleFilterKeywords), 255, '(separate keywords by comma ' +
        'if not using a regular expression)', 'Enter up to 255 characters, case insensitive if not using a regular ' +
        'expression')

      const titleFilterExceptionEnabledRow = extendWithCheckBox(appendRow(controlPanel, 2),
        'applyAdditionalFilters-titleFilterExceptionEnabled',
        settings.applyAdditionalFilters.titleFilterExceptionEnabled, 'Always temporarily disable this gallery title ' +
        'filter on')
      extendWithOptionSelector(titleFilterExceptionEnabledRow, 'applyAdditionalFilters-titleFilterExceptions',
        settings.applyAdditionalFilters.titleFilterExceptions, options.applyAdditionalFilters.titleFilterExceptions)

      // emptyCategoryFilter

      extendWithCheckBox(appendRow(controlPanel, 0), 'emptyCategoryFilter-featureEnabled',
        settings.emptyCategoryFilter.featureEnabled, 'Unselect all category filter buttons in the search box by ' +
        'default unless they have been set after a search, so that it is easier to select one or two categories')

      // fitThumbnailTitles

      extendWithCheckBox(appendRow(controlPanel, 0), 'fitThumbnailTitles-featureEnabled',
        settings.fitThumbnailTitles.featureEnabled, 'Adjust the height of each row in the thumbnail gallery list ' +
        'display mode to show full gallery titles')

      // colourCodeGalleries

      extendWithCheckBox(appendRow(controlPanel, 0), 'colourCodeGalleries-featureEnabled',
        settings.colourCodeGalleries.featureEnabled, 'Apply colour coding to new and expunged galleries on all ' +
        'types of gallery lists, except for gallery toplists, by colouring the titles and timestamps of new ' +
        'galleries blue and those of expunged galleries red')

      // useAutomatedDownloads

      extendWithCheckBox(appendRow(controlPanel, 0), 'useAutomatedDownloads-featureEnabled',
        settings.useAutomatedDownloads.featureEnabled, 'Add download shortcut buttons to automatically download ' +
        'galleries directly from all types of gallery lists (a few options below)')

      extendWithCheckBox(appendRow(controlPanel, 1), 'useAutomatedDownloads-torrentDownloadEnabled',
        settings.useAutomatedDownloads.torrentDownloadEnabled, 'Enable torrent download and prioritise it over ' +
        'archive download whenever a gallery has torrents')

      const torrentRequirementsEnabledRow = extendWithCheckBox(appendRow(controlPanel, 2),
        'useAutomatedDownloads-torrentRequirementsEnabled', settings.useAutomatedDownloads.torrentRequirementsEnabled,
        'Only prioritise it when the gallery has an up-to-date torrent with at least')
      extendWithTextInput(torrentRequirementsEnabledRow, 'useAutomatedDownloads-minimumSeedNumber',
        settings.useAutomatedDownloads.minimumSeedNumber, 1, 'seeds, but ignore this and download any torrent when ' +
        'the gallery is larger than', 'Enter an integer between 1 and 9, inclusive')
      extendWithTextInput(torrentRequirementsEnabledRow, 'useAutomatedDownloads-ignoreRequirementsSize',
        settings.useAutomatedDownloads.ignoreRequirementsSize, 4, 'MB, or if archive download is disabled', 'Enter ' +
        'an integer between 0 and 9999, inclusive')

      extendWithCheckBox(appendRow(controlPanel, 2), 'useAutomatedDownloads-personalisedTorrentEnabled',
        settings.useAutomatedDownloads.personalisedTorrentEnabled, 'Download personalised torrents instead of ' +
        'redistributable torrents when you are logged in to avoid occasional torrent download errors')

      extendWithCheckBox(appendRow(controlPanel, 2), 'useAutomatedDownloads-apiTorrentDownloadEnabled',
        settings.useAutomatedDownloads.apiTorrentDownloadEnabled, 'Use the more reliable GM.download() method to ' +
        'download torrents')

      const archiveDownloadEnabledRow = extendWithCheckBox(appendRow(controlPanel, 1),
        'useAutomatedDownloads-archiveDownloadEnabled', settings.useAutomatedDownloads.archiveDownloadEnabled,
        'Download this type of archive when torrent download is disabled above or unavailable:')
      extendWithOptionSelector(archiveDownloadEnabledRow, 'useAutomatedDownloads-archiveDownloadType',
        settings.useAutomatedDownloads.archiveDownloadType, options.useAutomatedDownloads.archiveDownloadType, '(the ' +
        '"auto select" archiver options in your EH gallery settings can override this archive type)')

      extendWithCheckBox(appendRow(controlPanel, 2), 'useAutomatedDownloads-appendIdentifiersEnabled',
        settings.useAutomatedDownloads.appendIdentifiersEnabled, 'Append identifiers to the filename of every ' +
        'archive downloaded by this feature so that other programs can use these to accurately retrieve metadata (' +
        'cannot work on some browsers like Google Chrome)')

      const pageDownloadEnabledRow = extendWithCheckBox(appendRow(controlPanel, 1),
        'useAutomatedDownloads-pageDownloadEnabled', settings.useAutomatedDownloads.pageDownloadEnabled, 'Enable the ' +
        'one-click page download button, which will automatically start downloads to download all galleries on a ' +
        'gallery list page using')
      extendWithTextInput(pageDownloadEnabledRow, 'useAutomatedDownloads-pageDownloadNumber',
        settings.useAutomatedDownloads.pageDownloadNumber, 1, 'concurrent gallery downloads per tab', 'Enter an ' +
        'integer between 1 and 9, inclusive')

      extendWithCheckBox(appendRow(controlPanel, 2), 'useAutomatedDownloads-pageRangeDownloadEnabled',
        settings.useAutomatedDownloads.pageRangeDownloadEnabled, 'Automatically start downloading the next page ' +
        'after a page has been fully downloaded in this page download mode, so that all pages in a page range can be ' +
        'downloaded in one click')

      extendWithCheckBox(appendRow(controlPanel, 2), 'useAutomatedDownloads-downloadProtectionEnabled',
        settings.useAutomatedDownloads.downloadProtectionEnabled, 'Enable download protection in this page download ' +
        'mode to prevent accidental interruptions by disabling most links and making galleries open in new tabs')

      extendWithCheckBox(appendRow(controlPanel, 1), 'useAutomatedDownloads-hideThumbnailEnabled',
        settings.useAutomatedDownloads.hideThumbnailEnabled, 'Hide each gallery\'s thumbnail cover after it ' +
        'has been downloaded in the extended and thumbnail gallery list display modes to make its completion more ' +
        'obvious')

      extendWithCheckBox(appendRow(controlPanel, 1), 'useAutomatedDownloads-downloadAlertsEnabled',
        settings.useAutomatedDownloads.downloadAlertsEnabled, 'Show error notification popups for download attempts ' +
        'that failed due to problems on the site\'s end')

      // openGalleriesSeparately

      extendWithCheckBox(appendRow(controlPanel, 0), 'openGalleriesSeparately-featureEnabled',
        settings.openGalleriesSeparately.featureEnabled, 'Open galleries in new tab by default from all types of ' +
        'gallery lists (one option below)')

      extendWithCheckBox(appendRow(controlPanel, 1), 'openGalleriesSeparately-directMpvEnabled',
        settings.openGalleriesSeparately.directMpvEnabled, 'Open the MPV directly when you click galleries in ' +
        'gallery lists (requires the MPV perk)')

      // Gallery view features -----------------------------------------------------------------------------------------

      controlPanel.insertRow(-1)
      extendWithStrongText(appendRow(controlPanel, 0), undefined, 'Gallery view features')

      // addVigilanteLinks

      extendWithCheckBox(appendRow(controlPanel, 0), 'addVigilanteLinks-featureEnabled',
        settings.addVigilanteLinks.featureEnabled, 'Add links to the main gallery maintenance threads in the ' +
        'vigilante subforum to the gallery information pane')

      // showAlternativeRating

      extendWithCheckBox(appendRow(controlPanel, 0), 'showAlternativeRating-featureEnabled',
        settings.showAlternativeRating.featureEnabled, 'Show a more objective alternative rating system inside ' +
        'galleries, which is based on the ratio of times favorited/rated (one option below)')
      extendWithCheckBox(appendRow(controlPanel, 1), 'showAlternativeRating-hideStarsEnabled',
        settings.showAlternativeRating.hideStarsEnabled, 'Hide the star rating section inside galleries completely ' +
        'and hence disable the ability to give star ratings')

      // parseExternalLinks

      extendWithCheckBox(appendRow(controlPanel, 0), 'parseExternalLinks-featureEnabled',
        settings.parseExternalLinks.featureEnabled, 'Transform URLs to external websites in gallery comments to ' +
        'clickable links (potentially risky if you cannot identify malicious links)')

      // Image view features -------------------------------------------------------------------------------------------

      controlPanel.insertRow(-1)
      extendWithStrongText(appendRow(controlPanel, 0), undefined, 'Image view features')

      // fitViewerToScreen

      extendWithCheckBox(appendRow(controlPanel, 0), 'fitViewerToScreen-featureEnabled',
        settings.fitViewerToScreen.featureEnabled, 'Fit images to screen instead of width in the basic image viewer ' +
        'and add a button to temporarily toggle the fit')

      // fitMpvToScreen

      extendWithCheckBox(appendRow(controlPanel, 0), 'fitMpvToScreen-featureEnabled',
        settings.fitMpvToScreen.featureEnabled, 'Fit images to screen instead of width in the MPV and add a button ' +
        'to temporarily toggle the fit (requires the MPV perk, a few options below)')

      extendWithCheckBox(appendRow(controlPanel, 1), 'fitMpvToScreen-makeDefaultEnabled',
        settings.fitMpvToScreen.makeDefaultEnabled, 'Fit images to screen instead of width by default')

      extendWithCheckBox(appendRow(controlPanel, 1), 'fitMpvToScreen-mpsModeEnabled',
        settings.fitMpvToScreen.mpsModeEnabled, 'Use the experimental multi-page spread mode to fit multiple images ' +
        'at once where possible, at the cost of mostly breaking MPV navigation methods besides scrolling')

      extendWithCheckBox(appendRow(controlPanel, 1), 'fitMpvToScreen-seamlessModeEnabled',
        settings.fitMpvToScreen.seamlessModeEnabled, 'Hide the information and buttons below each main image to make ' +
        'the MPV seamless')

      // hideMpvToolbar

      extendWithCheckBox(appendRow(controlPanel, 0), 'hideMpvToolbar-featureEnabled',
        settings.hideMpvToolbar.featureEnabled, 'Hide the vertical toolbar in the MPV, which can rest on top of ' +
        'images, and only reveal it on hover (requires the MPV perk)')

      // removeMpvTooltips

      extendWithCheckBox(appendRow(controlPanel, 0), 'removeMpvTooltips-featureEnabled',
        settings.removeMpvTooltips.featureEnabled, 'Remove the filename tooltips on the main images in the MPV ' +
        '(requires the MPV perk)')

      // relocateMpvThumbnails

      extendWithCheckBox(appendRow(controlPanel, 0), 'relocateMpvThumbnails-featureEnabled',
        settings.relocateMpvThumbnails.featureEnabled, 'Relocate the thumbnail pane and its scroll bar to the right ' +
        'side in the MPV, which should be more natural to use (requires the MPV perk)')

      // Upload management features ------------------------------------------------------------------------------------

      controlPanel.insertRow(-1)
      extendWithStrongText(appendRow(controlPanel, 0), undefined, 'Upload management features')

      // addGuideLinks

      extendWithCheckBox(appendRow(controlPanel, 0), 'addGuideLinks-featureEnabled',
        settings.addGuideLinks.featureEnabled, 'Add links to gallery upload guides to the upload management bar')

      // Script settings -----------------------------------------------------------------------------------------------

      controlPanel.insertRow(-1)
      extendWithStrongText(appendRow(controlPanel, 0), undefined, 'Script settings')

      extendWithCheckBox(appendRow(controlPanel, 0), 'script-filterButtonEnabled',
        settings.script.filterButtonEnabled, 'Show a button next to the gallery list display mode selector to easily ' +
        'switch the additional filters feature on/off as a whole without affecting the settings for individual filters')

      extendWithCheckBox(appendRow(controlPanel, 0), 'script-firefoxCompatibilityEnabled',
        settings.script.firefoxCompatibilityEnabled, 'Use Firefox compatibility mode to ensure the features that ' +
        'load early will always run, at the cost of causing noticeable visual changes when they are loaded')

      extendWithCheckBox(appendRow(controlPanel, 0), 'script-buttonTooltipEnabled',
        settings.script.buttonTooltipEnabled, 'Show tooltips on control buttons added by this userscript')

      // Use the actual width of the gallery list for the width of the control panel to make the transition seamless.
      controlPanel.style.width = `${galleryList.offsetWidth - 2 * 2 - 3 * 2}px`
      // This is mostly only needed for gallery toplists, which use wider compact display mode tables.
      controlPanel.style.maxWidth = controlPanel.style.width
      return controlPanel
    }

    /**
     * Appends a row to the end of a table element and sets an indent level for the text in this row.
     *
     * @param {HTMLTableElement} table - The table element to which a new row will be added.
     * @param {number} indentLevel - An integer that specifies the level of indent before the text in this row.
     * @returns {HTMLTableRowElement} The newly created and appended row.
     */
    const appendRow = function (table, indentLevel) {
      const row = table.insertRow(-1)
      if (indentLevel > 0) {
        row.className = `indent${indentLevel}`
      }
      return row
    }

    /**
     * Helps createControlPanel() to append an anchor element to a host element as a child node.
     *
     * @param {HTMLElement} host - The element under which the anchor element will be added as a child node.
     * @param {string} [id] - An optional id that can be assigned to the anchor element.
     * @param {string} text - The visible text content of the anchor element.
     * @param {string} url - The destination URL of the anchor element.
     * @param {boolean} bold - Whether or not the visible text will be bold.
     * @returns {HTMLElement} The element supplied for the "host" parameter above.
     */
    const extendWithAnchor = function (host, id, text, url, bold) {
      const anchor = document.createElement('a')
      if (typeof id !== 'undefined') {
        anchor.id = id
      }
      anchor.textContent = text
      anchor.href = url
      anchor.onclick = function (anchorEvent) {
        anchorEvent.preventDefault()
        window.open(url)
      }
      if (bold) {
        anchor.className = 'boldText'
      }
      host.appendChild(anchor)
      return host
    }

    /**
     * Helps createControlPanel() to append a strong element to a host element as a child node.
     *
     * @param {HTMLElement} host - The element under which the strong element will be added as a child node.
     * @param {string} [id] - An optional id that can be assigned to the strong element.
     * @param {string} text - The visible text content of the strong element.
     * @returns {HTMLElement} The element supplied for the "host" parameter above.
     */
    const extendWithStrongText = function (host, id, text) {
      const strong = document.createElement('strong')
      if (typeof id !== 'undefined') {
        strong.id = id
      }
      strong.textContent = text
      host.appendChild(strong)
      return host
    }

    /**
     * Helps createControlPanel() to append a checkbox input element to a host element as a child node.
     *
     * @param {HTMLElement} host - The element under which the checkbox input element will be added as a child node.
     * @param {string} [id] - An optional id that can be assigned to the checkbox input element.
     * @param {boolean} checked - Whether the checkbox will appear as ticked by default.
     * @param {string} [label] - An optional text label that will immediately follow this checkbox input element.
     * @returns {HTMLElement} The element supplied for the "host" parameter above.
     */
    const extendWithCheckBox = function (host, id, checked, label) {
      const box = document.createElement('input')
      box.type = 'checkbox'
      if (typeof id !== 'undefined') {
        box.id = id
      }
      if (checked) {
        box.checked = 'checked'
      }
      host.appendChild(box)
      if (typeof label !== 'undefined') {
        addLabel(host, id, label)
      }
      return host
    }

    /**
     * Helps createControlPanel() to append a text input element to a host element as a child node.
     *
     * @param {HTMLElement} host - The element under which the text input element will be added as a child node.
     * @param {string} [id] - An optional id that can be assigned to the text input element.
     * @param {string} defaultValue - The text that will appear inside the text input by default.
     * @param {number} length - An integer that specifies the maximum number of characters this text input will accept.
     * @param {string} [label] - An optional text label that will immediately follow this text input element.
     * @param {string} tooltip - A tooltip to be set on this text input.
     * @returns {HTMLElement} The element supplied for the "host" parameter above.
     */
    const extendWithTextInput = function (host, id, defaultValue, length, label, tooltip) {
      const input = document.createElement('input')
      input.type = 'text'
      if (typeof id !== 'undefined') {
        input.id = id
      }
      input.value = defaultValue
      // The width of this text input matches the "length" paramter, but is limited to a maximum of 30ch.
      input.style.width = `${Math.min(length, 30)}ch`
      input.maxLength = length
      // The tooltip is compulsory since at least the character limit for this input needs to be shown.
      setTooltip(input, tooltip)
      host.appendChild(input)
      if (typeof label !== 'undefined') {
        addLabel(host, id, label)
      }
      return host
    }

    /**
     * Helps createControlPanel() to append a select element to a host element as a child node.
     *
     * @param {HTMLElement} host - The element under which the select element will be added as a child node.
     * @param {string} [id] - An optional id that can be assigned to the select element.
     * @param {string} defaultOption - The option that will be selected and visible inside this selector by default.
     * @param {string[]} optionList - The array of options which can be selected under this select element.
     * @param {string} [label] - An optional text label that will immediately follow this select element.
     * @returns {HTMLElement} The element supplied for the "host" parameter above.
     */
    const extendWithOptionSelector = function (host, id, defaultOption, optionList, label) {
      const select = document.createElement('select')
      if (typeof id !== 'undefined') {
        select.id = id
      }
      for (const optionText of optionList) {
        const option = document.createElement('option')
        option.value = optionText
        option.textContent = optionText
        if (optionText === defaultOption) {
          option.setAttribute('selected', 'selected')
        }
        select.appendChild(option)
      }
      host.appendChild(select)
      if (typeof label !== 'undefined') {
        addLabel(host, id, label)
      }
      return host
    }

    /**
     * Helps other functions to add a label to an element.
     *
     * @param {HTMLElement} host - The element under which the label will be added as a child node.
     * @param {string} forId - The id of the element after which the label will be shown and to which it will bind.
     * @param {string} text - The text content of the label.
     */
    const addLabel = function (host, forId, text) {
      const label = document.createElement('label')
      label.setAttribute('for', forId)
      label.textContent = text
      host.appendChild(label)
    }

    /**
     * Converts a string array into a comma-separated string, or simply returns the argument if it is not an array.
     *
     * @param {(string[]|string)} potentialArray - A string array to be joined or a simple string.
     * @returns {string} A comma-separated string if a string array was provided; otherwise the same string that was
     * provided for "potentialArray".
     */
    const joinPotentialArray = function (potentialArray) {
      // This function is only used in one way, where array arguments will all have strings, so it does not need to
      // check whether the array provided actually contains strings.
      if (Array.isArray(potentialArray)) {
        return potentialArray.join(', ')
      } else {
        return potentialArray
      }
    }

    /**
     * Checks all user inputs for the settings in the control panel and saves the new settings to storage.
     *
     * The "settings" variable and the userscript storage will only be updated after all inputs have been confirmed to
     * be valid and formatted for storage, so nothing will be done if there is an invalid input.
     *
     * @returns {boolean} true if inputs for all settings have been checked and saved without any problem; otherwise
     * false if any of the inputs is invalid for its target setting.
     */
    const saveSettings = function () {
      // Check the inputs and put them in temporary storage first.
      const inputs = {}
      for (const feature of Object.keys(settings)) {
        for (const setting of Object.keys(settings[feature])) {
          const settingId = `${feature}-${setting}`
          if (settingId === 'script-version') {
            inputs[settingId] = api.info.script.version
            continue
          }
          const settingElement = document.getElementById(settingId)
          if (settingElement.type === 'checkbox') {
            inputs[settingId] = settingElement.checked
          } else if (settingElement.type === 'text') {
            inputs[settingId] = checkTextInput(settingElement.value.trim(), settingId)
            if (inputs[settingId] === null) {
              return false
            }
          } else if (settingElement.type === 'select-one') {
            inputs[settingId] = settingElement.value
          }
        }
      }

      // After all inputs have been confirmed to be valid and formatted appropriately, save the inputs to the "settings"
      // variable first. This also ensures that the control panel will show updated settings if it is opened again
      // before the page is reloaded.
      for (const feature of Object.keys(settings)) {
        for (const setting of Object.keys(settings[feature])) {
          const settingId = `${feature}-${setting}`
          settings[feature][setting] = inputs[settingId]
        }
      }
      // Save the updated settings to the userscript storage in JSON format.
      api.setValue('settings', JSON.stringify(settings))
      return true
    }

    /**
     * Checks whether or not a text input is appropriate for its target setting, and formats it for storage.
     *
     * @param {string} input - The raw text input entered by the user.
     * @param {string} settingId - The id of the control panel element in which this text input was entered.
     * @returns {(string|string[]|number[]|null)} A formatted version of the text input for storage, or '' if the
     * input is for a disabled setting and empty, or null if the input is invalid for the target setting.
     */
    const checkTextInput = function (input, settingId) {
      // Always require and save valid text inputs except for empty inputs for disabled settings, so that it is easy to
      // switch settings on/off.
      input = input.trim()
      switch (settingId) {
        case 'applyAdditionalFilters-ratedFilterStars':
          if (input.toLowerCase() === 'all') {
            return 'all'
          } else {
            const validNumbers = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
            const numbers = checkTextInputList(input, settingId, 'applyAdditionalFilters-ratedFilterEnabled',
              number => +number, number => validNumbers.includes(number))
            if (Array.isArray(numbers)) {
              return numbers.sort((a, b) => a - b)
            } else {
              return numbers
            }
          }
        case 'applyAdditionalFilters-favoritedFilterCategories':
          if (input.toLowerCase() === 'all') {
            return 'all'
          } else {
            return checkTextInputList(input, settingId, 'applyAdditionalFilters-favoritedFilterEnabled',
              category => category.toLowerCase(), category => category.length <= 20)
          }
        case 'applyAdditionalFilters-titleFilterKeywords':
          if (document.getElementById('applyAdditionalFilters-titleFilterType').value === 'one of the keywords') {
            return checkTextInputList(input, settingId, 'applyAdditionalFilters-titleFilterEnabled',
              keyword => keyword.toLowerCase(), undefined)
          } else {
            return checkTextInputRegex(input, settingId, 'applyAdditionalFilters-titleFilterEnabled')
          }
        case 'applyTextFilters-commentatorFilterUsernames':
          // Usernames are not converted to lowercase.
          return checkTextInputList(input, settingId, 'applyTextFilters-commentatorFilterEnabled', undefined,
            undefined)
        case 'applyTextFilters-commentFilterKeywords':
          return checkTextInputList(input, settingId, 'applyTextFilters-commentFilterEnabled',
            keyword => keyword.toLowerCase(), undefined)
        case 'applyTextFilters-posterFilterUsernames':
          // Usernames are not converted to lowercase.
          return checkTextInputList(input, settingId, 'applyTextFilters-posterFilterEnabled', undefined, undefined)
        case 'applyTextFilters-postFilterKeywords':
          return checkTextInputList(input, settingId, 'applyTextFilters-postFilterEnabled',
            keyword => keyword.toLowerCase(), undefined)
        case 'useAutomatedDownloads-minimumSeedNumber':
          return checkTextInputInteger(input, settingId, 'useAutomatedDownloads-torrentDownloadEnabled', /^[1-9]$/)
        case 'useAutomatedDownloads-ignoreRequirementsSize':
          return checkTextInputInteger(input, settingId, 'useAutomatedDownloads-torrentDownloadEnabled', /^\d+$/)
        case 'useAutomatedDownloads-pageDownloadNumber':
          return checkTextInputInteger(input, settingId, 'useAutomatedDownloads-pageDownloadEnabled', /^[1-9]$/)
      }
    }

    /**
     * Helps checkTextInput() to check and format a text input which can potentially include a comma-separated list.
     *
     * @param {string} input - The raw text input entered by the user.
     * @param {string} settingId - The id of the control panel input element in which this text input was entered.
     * @param {string} prerequisiteId - The id of the control panel checkbox element preceding this input element.
     * @param {Function} [conversionFunction] - An optional anonymous function to be applied to each item in the
     * comma-separated list to format it for storage and further custom testing by the "testFunction" below.
     * @param {Function} [testFunction] - An optional anonymous function with a boolean return value to be applied to
     * every item in the comma-separated list. For this text input to be considered valid, every item in the list must
     * pass this test with a true return value.
     * @returns {(string[]|number[]|string|null)} A formatted version of the text input for storage, or '' if the input
     * is for a disabled setting and empty, or null if the input is invalid for the target setting.
     */
    const checkTextInputList = function (input, settingId, prerequisiteId, conversionFunction, testFunction) {
      const settingPath = settingId.split('-')
      const featureId = `${settingPath[0]}-featureEnabled`
      // Full-width comma is supported. The filter() will handle /^.*?,+.*?$/ cases.
      let values = input.split(/[,，]/).map(value => value.trim()).filter(value => value.length > 0)
      if (values.length === 0) {
        // Empty input is only accepted when this (sub)feature or its parent feature is disabled.
        if (document.getElementById(featureId).checked && document.getElementById(prerequisiteId).checked) {
          alert(messages[settingPath[0]][settingPath[1]].emptyInputError)
          return null
        } else {
          return ''
        }
      } else {
        if (typeof conversionFunction !== 'undefined') {
          values = values.map(conversionFunction)
        }
        if (typeof testFunction !== 'undefined') {
          if (values.every(testFunction)) {
            return values
          } else {
            alert(messages[settingPath[0]][settingPath[1]].invalidInputError)
            return null
          }
        } else {
          return values
        }
      }
    }

    /**
     * Helps checkTextInput() to check and format a text input which should only contain an integer.
     *
     * @param {string} input - The raw text input entered by the user.
     * @param {string} settingId - The id of the control panel input element in which this text input was entered.
     * @param {string} prerequisiteId - The id of the control panel checkbox element preceding this input element.
     * @param {RegExp} testRegex - A RegExp object against which the text input will be tested. For this text input to
     * be considered valid, it must match this RegExp.
     * @returns {(number|string|null)} An integer number for storage, or '' if the input is for a disabled setting and
     * empty, or null if the input is invalid for the target setting.
     */
    const checkTextInputInteger = function (input, settingId, prerequisiteId, testRegex) {
      const settingPath = settingId.split('-')
      if (input === '') {
        if (document.getElementById(prerequisiteId).checked) {
          alert(messages[settingPath[0]][settingPath[1]].emptyInputError)
          return null
        } else {
          return ''
        }
      } else {
        if (testRegex.test(input)) {
          return +input
        } else {
          alert(messages[settingPath[0]][settingPath[1]].invalidInputError)
          return null
        }
      }
    }

    /**
     * Helps checkTextInput() to check and format a text input which should contain a regular expression.
     *
     * @param {string} input - The raw text input entered by the user.
     * @param {string} settingId - The id of the control panel input element in which this text input was entered.
     * @param {string} prerequisiteId - The id of the control panel checkbox element preceding this input element.
     * @returns {(string|null)} A regular expression saved as a string for storage, or '' if the input is for a disabled
     * setting and empty, or null if the input is invalid for the target setting.
     */
    const checkTextInputRegex = function (input, settingId, prerequisiteId) {
      const settingPath = settingId.split('-')
      // Check for empty input and inputs that only contain a number of "/".
      if (/^\/*$/.test(input)) {
        if (document.getElementById(prerequisiteId).checked) {
          alert(messages[settingPath[0]][settingPath[1]].emptyInputError)
          return null
        } else {
          return ''
        }
      } else {
        // Check for and remove possible forward slashes enclosing the regular expression.
        const pattern = input.match(/^\/(.*)\/$/)
        if (pattern !== null) {
          return pattern[1]
        } else {
          return input
        }
      }
    }

    /**
     * Closes and destroys the control panel without checking anything and restores the visibility of the gallery list.
     */
    const closeControlPanel = function () {
      const controlPanel = document.getElementById('controlPanel')
      controlPanel.parentNode.removeChild(controlPanel)
      galleryList.style.removeProperty('display')
      document.getElementById('openConfigButton').style.display = 'block'
      document.getElementById('saveConfigButton').style.display = 'none'
      document.getElementById('cancelConfigButton').style.display = 'none'
    }

    /**
     * Adds a button next to the gallery list display mode selector to swtich the additional filters feature on/off.
     */
    const addFilterButton = function () {
      // The additional filters cannot run on the gallery toplists, so there is no need to add the button.
      if (windowUrl.includes('toplist.php')) {
        return
      }

      let additionalFiltersButton
      if (settings.applyAdditionalFilters.featureEnabled) {
        additionalFiltersButton = createDmsButton('additionalFiltersButton', 'Disable Additional Filters',
          toggleAdditionalFilters, `Turn off all additional filters from ${api.info.script.name} and refresh the ` +
          'page to reload the gallery list')
      } else {
        additionalFiltersButton = createDmsButton('additionalFiltersButton', 'Enable Additional Filters',
          toggleAdditionalFilters, `Turn on the individual additional filters from ${api.info.script.name} which ` +
          'have been enabled in the control panel, and refresh the page to filter the gallery list')
      }
      const buttonHost = document.createElement('div')
      buttonHost.appendChild(additionalFiltersButton)
      document.getElementById('dms').appendChild(buttonHost)
    }

    /**
     * Toggles the additional filters feature in the settings but not its subfeatures, and reloads the page.
     *
     * @type {clickEventHandler}
     * @param {MouseEvent} clickEvent - The event object passed to this event handler on click.
     */
    const toggleAdditionalFilters = async function (clickEvent) {
      settings.applyAdditionalFilters.featureEnabled = !settings.applyAdditionalFilters.featureEnabled
      await api.setValue('settings', JSON.stringify(settings))
      window.location.reload()
    }

    addConfigButtons()
    settings.script.filterButtonEnabled && addFilterButton()
  }

  /**
   * Adds buttons to automatically download galleries or whole gallery lists directly from all types of gallery lists.
   */
  const useAutomatedDownloads = function () {
    /**
     * A callback function that runs on the document returned by an XHR to complete a step in a gallery download chain.
     *
     * @callback onloadFunction
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {Document} documentReceived - The parsed document returned by the last XHR.
     * @param {Object} [responseReceived] - The response from the last XHR, which is only required to start a download.
     */

    if (pageType !== 'gallery list') {
      return
    }

    const shortcuts = settings.useAutomatedDownloads
    const errors = messages.useAutomatedDownloads.runtime
    const domParser = new DOMParser()
    let inPageDownloadMode = false
    let originalTitle
    // This counter is used to ensure the "pageDownloadNumber" setting can be strictly enforced at all times.
    let concurrentDownloadsRunning = 0

    /**
     * Adds CSS styles to support download buttons added by this feature.
     *
     * In general, "cursor" and "opacity" need "!important" to override the properties on the popular list and all
     * gallery toplists, which already have "!important".
     */
    const addShortcutStyles = function () {
      let downloadShortcutStyles = `
        .cs, .cn { position: relative; }
        .galleryDownloadButton { position: absolute; top: 0; left: 0; box-shadow: none; transition-duration: 0.3s; }
        .galleryDownloadButton.idle { background-color: #22A7F0; opacity: 0 !important; cursor: pointer !important; }
        .galleryDownloadButton.loading, .galleryDownloadButton.downloading { background-color: #F7CA18;
          cursor: pointer !important; }
        .galleryDownloadButton.done { background-color: #000000; cursor: default !important; }
        .galleryDownloadButton.failed, .galleryDownloadButton.unavailable { background-color: #D91E18;
          cursor: pointer !important; }
        .galleryDownloadButton.idle:hover { box-shadow: 0 1px 7px 2px rgba(34, 167, 240, 0.6); }
        .galleryDownloadButton.failed:hover, .galleryDownloadButton.unavailable:hover {
          box-shadow: 0 1px 7px 2px rgba(217, 30, 24, 0.6); }
        #pageDownloadButton { width: 155px; left: 199px; }`

      // Add borders to match the category buttons in three of the four possible cases. The only scenario where borders
      // are not needed is the original EX without the light theme feature.
      if (windowUrl.includes('e-hentai.org') || settings.applyLightTheme.featureEnabled) {
        downloadShortcutStyles += `
          .galleryDownloadButton { margin: -1px; }`
        if (windowUrl.includes('e-hentai.org') && settings.applyDarkTheme.featureEnabled) {
          // The border will use the same colour as the button to hide itself and stay consistent with the theme.
          downloadShortcutStyles += `
            .galleryDownloadButton.idle { border: 1px solid #22A7F0; }
            .galleryDownloadButton.loading, .galleryDownloadButton.downloading { border: 1px solid #F7CA18; }
            .galleryDownloadButton.done { border: 1px solid #000000; }
            .galleryDownloadButton.failed, .galleryDownloadButton.unavailable { border: 1px solid #D91E18; }`
        } else {
          // In the other two cases, the HSV brightness of each button colour is reduced by 20 to derive the
          // corresponding border colour.
          downloadShortcutStyles += `
            .galleryDownloadButton.idle { border: 1px solid #1A84BD; }
            .galleryDownloadButton.loading, .galleryDownloadButton.downloading { border: 1px solid #C4A114; }
            .galleryDownloadButton.done { border: 1px solid #000000; }
            .galleryDownloadButton.failed, .galleryDownloadButton.unavailable { border: 1px solid #A61712; }`
        }
      }

      // Set the hover behaviour and button size in each display mode.
      switch (displayMode) {
        case 'minimal':
        case 'minimal+':
          downloadShortcutStyles += `
            tr:hover .galleryDownloadButton { display: inline-block; opacity: 1 !important; }
            .cs:not([data-disabled]):hover { opacity: 1 !important; }`
          break
        case 'compact':
          downloadShortcutStyles += `
            tr:hover .galleryDownloadButton { display: inline-block; opacity: 1 !important; }
            .cn:not([data-disabled]):hover { opacity: 1 !important; }`
          break
        case 'extended':
          downloadShortcutStyles += `
            .galleryDownloadButton { width: 110px; }
            tr:hover .galleryDownloadButton { display: inline-block; opacity: 1 !important; }
            .cn:not([data-disabled]):hover { opacity: 1 !important; }`
          break
        case 'thumbnail':
          downloadShortcutStyles += `
            .galleryDownloadButton { height: 18px; width: 110px; line-height: 18px; }
            .gl1t:hover .galleryDownloadButton { display: inline-block; opacity: 1 !important; }
            .cs:not([data-disabled]):hover { opacity: 1 !important; }`
      }
      appendStyleText(document.head, 'downloadShortcutStyles', downloadShortcutStyles)
    }

    /**
     * Adds all gallery download buttons and also the page download button to the gallery list.
     */
    const addDownloadButtons = function () {
      let bases
      let galleries
      let thumbnails
      switch (displayMode) {
        case 'minimal':
        case 'minimal+':
          bases = document.body.querySelectorAll('.gl1m.glcat > .cs')
          galleries = document.body.querySelectorAll('.gl3m.glname > a')
          break
        case 'compact':
          bases = document.body.querySelectorAll('.gl1c.glcat > .cn')
          galleries = document.body.querySelectorAll('.gl3c.glname > a')
          break
        case 'extended':
          bases = document.body.querySelectorAll('.gl3e > .cn')
          galleries = document.body.querySelectorAll('.gl2e > div > a')
          thumbnails = document.body.querySelectorAll('.gl1e > div > a')
          break
        case 'thumbnail':
          bases = document.body.querySelectorAll('.gl5t > div > .cs')
          // In this display mode, the anchors on gallery titles are located differently in the DOM tree between the
          // search index and the favorite list, but the anchors on gallery thumbnails are not. Therefore, one selector
          // can be safely used for both page types. The same set of anchors from this selector can also be used to
          // acquire both the gallery addresses and the thumbnail images below.
          galleries = document.body.querySelectorAll('.gl3t > a')
          thumbnails = document.body.querySelectorAll('.gl3t > a')
      }
      const torrents = document.body.querySelectorAll('.gldown')
      const timestamps = document.body.querySelectorAll('div[id ^= "posted_"]')

      let i = bases.length
      while (i--) {
        const galleryDownloadButton = document.createElement('div')
        if (displayMode === 'compact' || displayMode === 'extended') {
          galleryDownloadButton.className = 'cn galleryDownloadButton idle'
        } else {
          galleryDownloadButton.className = 'cs galleryDownloadButton idle'
        }
        galleryDownloadButton.textContent = 'Download'
        galleryDownloadButton.gallery = galleries[i].href
        if (typeof thumbnails !== 'undefined') {
          galleryDownloadButton.dataThumbnail = thumbnails[i]
        }

        // If there is indeed a torrent, the child will be "A"; otherwise it will be "IMG".
        if (shortcuts.torrentDownloadEnabled && torrents[i].firstElementChild.nodeName === 'A') {
          // Add torrent information to the button when torrent download is enabled and also available for this gallery.
          galleryDownloadButton.torrent = torrents[i].firstElementChild.href
        } else if (!shortcuts.archiveDownloadEnabled) {
          // When archive download is disabled, a button will not be added if torrent download is not possible.
          continue
        }
        galleryDownloadButton.timestamp = Date.parse(timestamps[i].textContent)
        galleryDownloadButton.addEventListener('click', handleGalleryDownload)
        bases[i].removeAttribute('onclick')
        bases[i].appendChild(galleryDownloadButton)
      }

      if (shortcuts.pageDownloadEnabled) {
        originalTitle = document.title
        // Add a button next to the script configuration button to download one or more pages in one click.
        const pageDownloadButton = createDmsButton('pageDownloadButton', '', attemptPageDownload, '')
        document.getElementById('configButtonHost').appendChild(pageDownloadButton)
        changePageDownloadState('idle')
      }
    }

    /**
     * Checks the state of a gallery download button when it is clicked and decides what will happen.
     *
     * @type {clickEventHandler}
     * @param {MouseEvent} clickEvent - The event object passed to this event handler on click.
     */
    const handleGalleryDownload = function (clickEvent) {
      const galleryDownloadButton = clickEvent.target
      if (/loading|downloading/.test(galleryDownloadButton.className)) {
        // Cancel the attempt if the button is clicked while it is loading or downloading.
        changeGalleryDownloadState(galleryDownloadButton, 'idle')
      } else if (galleryDownloadButton.className.includes('done')) {
        // Do nothing if the download attempt has already been successful. This onclick function is not removed, because
        // this button will be reverted to idle if the user cancel an archive file download before it completes.
      } else {
        // If the button state is "idle", "unavailable" or "failed":
        changeGalleryDownloadState(galleryDownloadButton, 'loading')
        if (typeof galleryDownloadButton.torrent !== 'undefined') {
          attemptDownloadStep(galleryDownloadButton, galleryDownloadButton.torrent, selectTargetTorrent)
        } else {
          // Stop the archive download attempt right away if GM.download() is not available.
          if (!shortcuts.archiveDownloadType.includes('H@H') && typeof api.download === 'undefined') {
            handleError(galleryDownloadButton, 'gmDownloadNotSupportedError')
          } else {
            attemptDownloadStep(galleryDownloadButton, galleryDownloadButton.gallery, passGalleryView)
          }
        }
      }
    }

    // Common functions in all download chains

    /**
     * Uses GET or POST to request a page via XHR, and runs the supplied function on load.
     *
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this attempt.
     * @param {string} targetUrl - The URL to which this XHR will be sent.
     * @param {onloadFunction} onloadFunction - The function that will run on the successful response from this XHR.
     * @param {string} [formData] - The form data to be submitted via POST.
     */
    const attemptDownloadStep = function (galleryDownloadButton, targetUrl, onloadFunction, formData) {
      // Check whether the button is in the "loading" state, which is the only state where this function should run. If
      // the user has clicked the gallery download button to cancel the download when it is still loading, the next
      // download step in the chain should not be attempted. Therefore, the state is checked below to prevent this
      // function from running and stop the chain when the state is not right. This allows the user to abort a download
      // attempt when another step is running between the completion of the last XHR and the start of the next XHR.
      if (!galleryDownloadButton.className.includes('loading')) {
        return
      }

      const xhrDetails = {
        synchronous: false,
        timeout: 30000,
        url: targetUrl,
        onload: function (response) {
          const documentReceived = domParser.parseFromString(response.responseText, 'text/html')
          if (response.status === 200) {
            // At least "unavailableTorrentError" comes with status code 200, so a check is needed for the specific
            // onloadFunction. My old comments say "unavailableArchiverError" might also come with status code 200, but
            // this cannot be confirmed these days and is thus not handled below.
            if (onloadFunction.name === 'downloadTorrent' &&
              checkErrorMessage(documentReceived.body.textContent) === 'unavailableTorrentError') {
              handleError(galleryDownloadButton, checkErrorMessage(documentReceived.body.textContent),
                documentReceived.documentElement.outerHTML)
            } else {
              onloadFunction(galleryDownloadButton, documentReceived, response)
            }
          } else if (response.status === 404) {
            handleError(galleryDownloadButton, 'unavailableGalleryError')
          } else {
            handleError(galleryDownloadButton, checkErrorMessage(documentReceived.body.textContent),
              documentReceived.documentElement.outerHTML)
          }
        },
        ontimeout: function (response) {
          // Retry this step after the 30s timeout, until the user aborts this download attempt using the button.
          attemptDownloadStep(galleryDownloadButton, targetUrl, onloadFunction, formData)
        }
      }

      if (typeof formData === 'undefined') {
        xhrDetails.method = 'GET'
      } else {
        xhrDetails.method = 'POST'
        xhrDetails.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
        xhrDetails.data = formData
      }

      const errorHandler = function (runtimeError) {
        if (Object.keys(runtimeError).length === 0) {
          // An empty error object will be thrown when a file processing page is too slow to load. This is simply
          // ignored to let the XHR finish loading this page.
        } else if (typeof runtimeError.error !== 'undefined') {
          if (runtimeError.error.includes('Request was blocked by the user')) {
            handleError(galleryDownloadButton, 'crossOriginNotAllowedError')
          } else {
            handleError(galleryDownloadButton, 'unknownError')
          }
        } else {
          // Other errors should be network errors.
          handleError(galleryDownloadButton, 'networkError')
        }
      }
      if (api.version === 'v4') {
        galleryDownloadButton.xhr = api.xmlHttpRequest(xhrDetails)
        galleryDownloadButton.xhr.catch(errorHandler)
      } else {
        xhrDetails.onerrror = errorHandler
        galleryDownloadButton.xhr = api.xmlHttpRequest(xhrDetails)
      }
    }

    /**
     * Checks the status of an XHR to a download address and decides how to proceed without loading the whole response.
     *
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this attempt.
     * @param {string} downloadUrl - The URL to which this XHR will be sent to request the file download for testing.
     * @param {onloadFunction} onloadFunction - The function that will run when this XHR detects a file download.
     */
    const testDownloadHeaders = function (galleryDownloadButton, downloadUrl, onloadFunction) {
      // Check the state of the gallery download button for the same reason as in attemptDownloadStep().
      if (!galleryDownloadButton.className.includes('loading')) {
        return
      }

      const xhrDetails = {
        method: 'GET',
        synchronous: false,
        timeout: 30000,
        url: downloadUrl,
        onreadystatechange: function (response) {
          if (response.readyState === 2) {
            // This is the "HEADERS_RECEIVED" ready state, and headers can now be checked to see if a file or HTML page
            // is being serverd from this download address.
            if (response.responseHeaders.includes('content-type: text/html')) {
              // If "content-type" is "text/html; charset=UTF-8", a file download is not being served, so there is an
              // error. In this case, this test XHR is not aborted, and instead it will complete like a normal XHR to
              // handle the error on load in the "response.readyState === 4" case below.
            } else {
              // When a file download is being served, let this test XHR abort itself to prevent it from downloading the
              // whole response, and start the actual file download using the supplied function.
              galleryDownloadButton.xhr.abort()
              onloadFunction(galleryDownloadButton, undefined, response)
            }
          } if (response.readyState === 4) {
            // If the XHR is not aborted and reaches the "load" ready state, there must be an application error.
            const documentReceived = domParser.parseFromString(response.responseText, 'text/html')
            handleError(galleryDownloadButton, checkErrorMessage(documentReceived.body.textContent),
              documentReceived.documentElement.outerHTML)
          }
        },
        ontimeout: function (response) {
          // Retry this step after the 30s timeout, until the user aborts this download attempt using the button.
          testDownloadHeaders(galleryDownloadButton, downloadUrl, onloadFunction)
        }
      }

      const errorHandler = function (runtimeError) {
        if (runtimeError.error) {
          handleError(galleryDownloadButton, 'unknownError')
          // This function runs at the final file download stage, so it should not need to check for
          // "crossOriginNotAllowedError", because this error would have happened earlier in the chain before this
          // function can be reached, namely at the download ready stage.
        } else {
          // Other errors should be network errors.
          handleError(galleryDownloadButton, 'networkError')
        }
      }
      if (api.version === 'v4') {
        galleryDownloadButton.xhr = api.xmlHttpRequest(xhrDetails)
        galleryDownloadButton.xhr.catch(errorHandler)
      } else {
        xhrDetails.onerrror = errorHandler
        galleryDownloadButton.xhr = api.xmlHttpRequest(xhrDetails)
      }
    }

    /**
     * Downloads a file, which could be an archive or a torrent, using the reliable GM.download() method.
     *
     * This function assumes that a testing step has been completed before it to check for application errors. Also,
     * unlike any other function in this script, this function effectively only supports Tampermonkey.
     *
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this attempt.
     * @param {string} downloadUrl - The URL to which this XHR will be sent to request the file download.
     * @param {string} filename - The full filename for the file to be downloaded and saved.
     */
    const downloadUsingApi = function (galleryDownloadButton, downloadUrl, filename) {
      if (typeof api.download === 'undefined') {
        handleError(galleryDownloadButton, 'gmDownloadNotSupportedError')
        return
      }

      // Replace illegal characters in the filename with their legal, full-width versions to better preserve the gallery
      // title. This should not apply to Chromium browsers because they always respect the filename from the response
      // headers, but still helps. Some of these illegal characters like "/" are already automatically converted to
      // spaces by the site in the headers, while others like ":" are not.
      let formattedName = replaceIllegalCharacters(filename)
      // The filename change below will not work on Chromium browsers because they always respect the response headers.
      const extensionSplit = formattedName.match(/(.+?)(\.zip|\.torrent)$/)
      if (extensionSplit[2] === '.zip' && shortcuts.appendIdentifiersEnabled) {
        const identifiers = galleryDownloadButton.gallery.match(/e(?:-|x)hentai\.org\/g\/(\d+)\/([0-9a-z]+)/)
        formattedName = `${extensionSplit[1]} [GID ${identifiers[1]} GT ${identifiers[2]}]${extensionSplit[2]}`
      }

      const xhrDetails = {
        url: downloadUrl,
        name: formattedName,
        saveAs: false,
        timeout: 30000,
        onload: function (response) {
          // The button will only move to the "done" state when the file download is finished.
          changeGalleryDownloadState(galleryDownloadButton, 'done')
        },
        ontimeout: function (response) {
          // Retry the download after the 30s timeout, until the user aborts this download attempt using the button.
          downloadUsingApi(galleryDownloadButton, downloadUrl, filename)
        },
        onabort: function (response) {
          changeGalleryDownloadState(galleryDownloadButton, 'idle')
        }
      }
      changeGalleryDownloadState(galleryDownloadButton, 'downloading')

      // There is no if branch for adding xhrDetails.onerror, since this function does not support GM API v3.
      galleryDownloadButton.xhr = api.download(xhrDetails)
      galleryDownloadButton.xhr.catch(function (runtimeError) {
        switch (runtimeError.error) {
          case 'not_enabled':
          case 'not_permitted':
            handleError(galleryDownloadButton, 'gmDownloadNotEnabledError')
            break
          case 'not_whitelisted':
            handleError(galleryDownloadButton, 'gmDownloadFileExtensionError')
            break
          case 'not_supported':
            handleError(galleryDownloadButton, 'gmDownloadNotSupportedError')
            break
          case 'not_succeeded':
            if (typeof runtimeError.details === 'undefined' || runtimeError.details.current === 'USER_CANCELED') {
              // Reset the button state when the user cancels the file download in the browser before it is completed.
              // The details property does not exist on Firefox, at least in this case.
              changeGalleryDownloadState(galleryDownloadButton, 'idle')
            } else if (runtimeError.details.current === 'NETWORK_FAILED') {
              handleError(galleryDownloadButton, 'networkError')
            } else if (runtimeError.details.current === 'SERVER_FAILED') {
              // The test-and-download process will be tried again when some server problem breaks the download.
              if (filename.includes('.torrent')) {
                attemptDownloadStep(galleryDownloadButton, downloadUrl, downloadTorrent)
              } else {
                testDownloadHeaders(galleryDownloadButton, downloadUrl, downloadArchive)
              }
            }
            break
          case 'filename must not contain illegal characters':
            handleError(galleryDownloadButton, 'illegalFilenameError')
        }
      })
    }

    /**
     * Helps downloadUsingApi() to replace illegal characters in a filename with their full-width versions.
     *
     * The illegal characters are taken from the wikipedia page on filename except for tilde. Tilde is allowed in
     * filenames, but needs to be replaced because it can stop GM.download() from download files on Chromium browsers.
     *
     * @param {string} filename - The filename string to be checked and potentially formatted.
     */
    const replaceIllegalCharacters = function (filename) {
      const fullWidthReplacements = {
        '/': '／',
        '\\\\': '＼',
        '\\?': '？',
        '%': '％',
        '\\*': '＊',
        ':': '：',
        '\\|': '｜',
        '"': '＂',
        '<': '＜',
        '>': '＞',
        '~': '～',
        '\\s': ' ',
        // JavaScript does not support regex POSIX classes, so a huge list from https://stackoverflow.com/a/11598864 has
        // to be used instead to remove control codes.
        ['[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588' +
          '\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C' +
          '\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980' +
          '\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6' +
          '\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A' +
          '\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84' +
          '\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00' +
          '\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-' +
          '\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2' +
          '\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-' +
          '\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65' +
          '\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD' +
          '\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F' +
          '\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE' +
          '\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C' +
          '\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA' +
          '\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249' +
          '\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7' +
          '\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D' +
          '\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF' +
          '\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-' +
          '\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E' +
          '\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C' +
          '\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58' +
          '\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-' +
          '\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF' +
          '\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C' +
          '\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-' +
          '\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F' +
          '\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F' +
          '\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-' +
          '\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F' +
          '\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27' +
          '\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF' +
          '\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-' +
          '\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1' +
          '\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]']: ''
      }
      for (const character of Object.keys(fullWidthReplacements)) {
        filename = filename.replace(new RegExp(character, 'gi'), fullWidthReplacements[character])
      }
      // Remove leading spaces, which are not accepted by GM.download().
      return filename.trim()
    }

    /**
     * Downloads a file, which is limited to a torrent for this function, using the less reliable iframe method.
     *
     * This function assumes that a testing step has been completed before it to check for application errors.
     *
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this attempt.
     * @param {string} downloadUrl - The URL that will be loaded by the iframe to receive the file download.
     */
    const downloadUsingIframe = function (galleryDownloadButton, downloadUrl) {
      const iframe = document.createElement('iframe')
      iframe.display = 'none'
      iframe.src = downloadUrl
      document.body.appendChild(iframe)
      // Remove the download iframe only after 15 seconds because torrent downloads might start slowly.
      setTimeout(() => { document.body.removeChild(iframe) }, 15000)
      changeGalleryDownloadState(galleryDownloadButton, 'done')
    }

    /**
     * Changes the state of a gallery download button and the concurrent download counter, and cleans up where needed.
     *
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button to be changed.
     * @param {string} targetState - 'idle', 'loading', 'downloading', 'done', 'unavailable', or 'failed'.
     * @param {string} [tooltip] - An optional non-empty tooltip to be set on the gallery download button.
     */
    const changeGalleryDownloadState = function (galleryDownloadButton, targetState, tooltip) {
      galleryDownloadButton.className = `${galleryDownloadButton.className.match(/^(cs|cn)/)[1]} ` +
        `galleryDownloadButton ${targetState}`

      // Set the button text.
      if (targetState === 'idle') {
        galleryDownloadButton.textContent = 'Download'
      } else {
        galleryDownloadButton.textContent = targetState.charAt(0).toUpperCase() + targetState.substring(1)
      }

      // Set the button tooltip, or remove it when the target state is not one of the error states.
      if (targetState === 'unavailable' || targetState === 'failed') {
        if (typeof tooltip !== 'undefined') {
          // Set the title attribute directly instead of using setTooltip(), so that these tooltips will not be disabled
          // even if "settings.script.buttonTooltipEnabled" is false. This way the user can always see the reason why
          // each download failed.
          galleryDownloadButton.title = tooltip
        }
      } else {
        galleryDownloadButton.removeAttribute('title')
      }

      // Increase the concurrent download counter when a gallery download is started.
      if (targetState === 'loading') {
        concurrentDownloadsRunning += 1
      }

      // Hide the gallery cover thumbnail after a successful download when this option is enabled and applicable.
      if (targetState === 'done') {
        if (typeof galleryDownloadButton.dataThumbnail !== 'undefined' && shortcuts.hideThumbnailEnabled) {
          galleryDownloadButton.dataThumbnail.parentNode.style.visibility = 'hidden'
        }
      }

      // Clean up when moving to any of the terminal states.
      if (targetState !== 'loading' && targetState !== 'downloading') {
        // Abort any running XHR, and remove the XHR object and the recorded archiver hostname. Doing the clean-up here
        // allows XHRs to abort themselves in their event properties without side effects.
        if (typeof galleryDownloadButton.xhr !== 'undefined') {
          galleryDownloadButton.xhr.abort()
          delete galleryDownloadButton.xhr
        }
        if (typeof galleryDownloadButton.archiver !== 'undefined') {
          delete galleryDownloadButton.archiver
        }

        concurrentDownloadsRunning -= 1
        if (shortcuts.pageDownloadEnabled) {
          checkPageCompletion()
          // Attempt the next gallery download in the page download mode. This does guarantee a download can be started.
          if (inPageDownloadMode) {
            attemptPageDownload()
          }
        }
      }
    }

    // Error handling

    /**
     * Checks an error message and returns the type of the error.
     *
     * Some of the errors come from the list of technical issues: https://ehwiki.org/wiki/Technical_Issues
     *
     * @param {string} message - A message that should indicate the type of error.
     */
    const checkErrorMessage = function (message) {
      message = message.toLowerCase()
      if (message.includes('service unavailable')) {
        // When the site returns this 503 error, the statusText seems empty.
        return 'serviceUnavailableError'
      } else if (message.includes('backend fetch failed')) {
        return 'backendFetchError'
      } else if (message.includes('the archiver assigned to this archive is temporarily unavailable')) {
        return 'unavailableArchiverError'
      } else if (message.includes('the torrent file could not be found')) {
        return 'unavailableTorrentError'
      } else if (message.includes('this gallery is currently unavailable')) {
        // This probably only happens when the torrent list of a removed gallery is accessed. This if branch should
        // never run, because the status code will be 404 in this case and the XHR will directly call handleError().
        return 'unavailableGalleryError'
      } else if (message.includes('you have clocked too many downloaded bytes on this gallery')) {
        return 'downloadedBytesError'
      } else if (message.includes('expired or invalid session')) {
        return 'expiredSessionError'
      } else if (message.includes('you are opening pages too fast')) {
        // Not sure whether this warning actually shows up in practice, but it is included in case it will help.
        return 'heavyLoadError'
      } else if (message.includes('your ip address has been temporarily banned')) {
        return 'temporaryBanError'
      } else {
        return 'unknownError'
      }
    }

    /**
     * Handles an error by changing the state of the gallery download button involved and showing an alert.
     *
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with the error.
     * @param {string} error - The type of the error.
     * @param {string} [html] - The outer HTML of the entire document element of the page that gave the error.
     */
    const handleError = function (galleryDownloadButton, error, html) {
      let alertMessage = errors[error]
      switch (error) {
        // These are download errors that can always happen. Message alerts for these can be switched off. The download
        // will not be retried on a network error because the network problem may last for a while.
        case 'networkError':
        case 'serviceUnavailableError':
        case 'backendFetchError':
        case 'unavailableArchiverError':
        case 'unavailableTorrentError':
          changeGalleryDownloadState(galleryDownloadButton, 'unavailable', alertMessage)
          shortcuts.downloadAlertsEnabled && alert(alertMessage)
          break
        case 'unavailableGalleryError':
        case 'downloadedBytesError':
        case 'expiredSessionError':
        case 'illegalFilenameError':
          changeGalleryDownloadState(galleryDownloadButton, 'failed', alertMessage)
          shortcuts.downloadAlertsEnabled && alert(alertMessage)
          break
        // These errors relate to temporary bans and are always shown.
        case 'heavyLoadError':
        case 'temporaryBanError':
          changeGalleryDownloadState(galleryDownloadButton, 'unavailable', alertMessage)
          // Stop the page download mode if it is active, because otherwise most downloads would just fail.
          if (inPageDownloadMode) {
            document.getElementById('pageDownloadButton').click()
            alertMessage += ' The page download has been stopped.'
          }
          alert(alertMessage)
          break
        // These are setup errors that would only happen when this script is not used properly. Alerts are always shown
        // for these because the user should immediately change how this script is used.
        case 'notLoggedInError':
        case 'autoSelectHathError':
        case 'unqualifiedHathError':
        case 'gmDownloadFileExtensionError':
        case 'gmDownloadNotEnabledError':
        case 'gmDownloadNotSupportedError':
        case 'crossOriginNotAllowedError':
          changeGalleryDownloadState(galleryDownloadButton, 'failed', alertMessage)
          // Stop the page download mode if it is active, because otherwise most downloads would just fail.
          if (inPageDownloadMode) {
            document.getElementById('pageDownloadButton').click()
            alertMessage += ' The page download has been stopped.'
          }
          alert(alertMessage)
          break
        // Unknown errors are always shown but do not stop the page download mode. The notification popup will however
        // pause the start of new gallery downloads in this mode until it is clicked.
        case 'unknownError':
          changeGalleryDownloadState(galleryDownloadButton, 'failed', alertMessage)
          // Stop the page download mode if it is active, because new downloads can also fail.
          if (inPageDownloadMode) {
            document.getElementById('pageDownloadButton').click()
            alertMessage += ' The page download has been stopped.'
          }
          // A log file can be automatically generated and downloaded when an unknown error is encountered.
          if (typeof html !== 'undefined') {
            alertMessage += ' An error log will be automatically downloaded, which can be submitted to the author in ' +
              'a bug report.'
            const errorLog = `Function:\nuseAutomatedDownloads\n\nURL:\n${windowUrl}\n\nHTML:\n${html}`
            downloadTextData(errorLog, `${api.info.script.name} v${api.info.script.version} - Error Log`)
          }
          alert(alertMessage)
      }
    }

    // Torrent download chain

    /**
     * Reads a torrent list page, checks the torrents and selects the best one to download if possible.
     *
     * It uses attemptDownloadStep() instead of testDownloadStatus() to test the download status, because torrents are
     * small enough to be fully loaded without a delay, and a type of error can occur with a status code of 200, which
     * can only be caught on load.
     *
     * @type {onloadFunction}
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {Document} documentReceived - The parsed document returned by the last XHR.
     */
    const selectTargetTorrent = function (galleryDownloadButton, documentReceived) {
      // Check whether the page is actually a torrent list page. This check should be unnecessary, which is why an
      // unknown error will be thrown.
      if (documentReceived.getElementById('torrentinfo') === null) {
        handleError(galleryDownloadButton, 'unknownError', documentReceived.documentElement.outerHTML)
        return
      }

      // Obtain the status of each torrent in the torrent list, but only include the ones that have active download
      // links i.e., exclude expunged but seeded torrents still staying in the list.
      let torrents = Array.from(documentReceived.getElementsByTagName('table'), analyseTorrentTable)
        .filter(torrent => typeof torrent !== 'undefined')
      if (shortcuts.torrentRequirementsEnabled && shortcuts.archiveDownloadEnabled) {
        // When the seed requirement is enabled and the archive download is also enabled as a fallback option, firstly
        // obtain the up-to-date, seeded torrents.
        torrents = torrents.filter(torrent => torrent.timestamp >= galleryDownloadButton.timestamp)
          .filter(torrent => torrent.seeds > 0)
        // Then, sort them by size in descending order. When two torrents have the same size, a multi-criteria sort is
        // done to prioritise the one with more seeds.
        torrents = torrents.sort((a, b) => b.size - a.size === 0 ? b.seeds - a.seeds : b.size - a.size)
        if (torrents.length > 0 && torrents[0].size > shortcuts.ignoreRequirementsSize) {
          // Download the largest torrent right away if the gallery is too large for archive download judging by this
          // largest torrent.
          attemptDownloadStep(galleryDownloadButton, torrents[0].torrent, downloadTorrent)
        } else {
          // Otherwise filter the torrents by the minimum seed number requirement and download the largest.
          torrents = torrents.filter(torrent => torrent.seeds >= shortcuts.minimumSeedNumber)
          if (torrents.length > 0) {
            attemptDownloadStep(galleryDownloadButton, torrents[0].torrent, downloadTorrent)
          } else {
            // Automatically download the archive instead when the available torrents do not meet the requirments.
            galleryDownloadButton.torrent = undefined
            // Directly use the code from handleGalleryDownload() instead of moving the button back to the "idle" state
            // and clicking it to download the archive, because that first step will trigger the download of another
            // gallery and cause this gallery to be temporarily skipped in the page download mode.
            if (!shortcuts.archiveDownloadType.includes('H@H') && typeof api.download === 'undefined') {
              handleError(galleryDownloadButton, 'gmDownloadNotSupportedError')
            } else {
              attemptDownloadStep(galleryDownloadButton, galleryDownloadButton.gallery, passGalleryView)
            }
          }
        }
      } else {
        // When the seed requirement and the archive download option are not both enabled, download the most seeded
        // torrent without any checks.
        torrents = torrents.sort((a, b) => b.seeds - a.seeds)
        attemptDownloadStep(galleryDownloadButton, torrents[0].torrent, downloadTorrent)
      }
    }

    /**
     * Helps selectTargetTorrent() to extract data from a torrent information table in a torrent list page.
     *
     * @param {HTMLTableElement} table - A table element that shows the status of a torrent.
     * @returns {Object} An object literal containing the torrent data, or undefined if the torrent has been expunged.
     */
    const analyseTorrentTable = function (table) {
      const torrent = table.getElementsByTagName('a')[0]
      if (typeof torrent === 'undefined') {
        // If an anchor cannot be found within a torrent information table, it means this torrent has been expunged and
        // its download link is unavailable. It should be removed from the torrent list when it becomes unseeded.
        // undefined will be returned and this torrent will need to be screen out based on this.
      } else {
        // Convert GB and KB to MB.
        const sizeAndUnit = table.textContent.match(/Size:\s*([0-9.]+)\s*(KB|MB|GB)/)
        let size = +sizeAndUnit[1]
        if (sizeAndUnit[2] === 'KB') {
          size /= 1024
        } else if (sizeAndUnit[2] === 'GB') {
          size *= 1024
        }
        return {
          // torrent.href is always the URL for the reditributable torrent, but the onclick attribute will have the
          // modified URL for the personalised torrent when logged in; if not logged in, the onclick will just have the
          // same URL as .href.
          torrent: shortcuts.personalisedTorrentEnabled
            ? torrent.getAttribute('onclick').match(/^document.location='(.+)'; return false$/)[1] : torrent.href,
          timestamp: Date.parse(table.textContent.match(/Posted:\s*([0-9-]+\s*[0-9:]+)/)[1]),
          size: size,
          seeds: +table.textContent.match(/Seeds:\s*(\d+)/)[1],
          peers: +table.textContent.match(/Peers:\s*(\d+)/)[1]
        }
      }
    }

    /**
     * Checks for a possible error and downloads the torrent file using GM.download() or an iframe.
     *
     * @type {onloadFunction}
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {Document} documentReceived - The parsed document returned by the last XHR.
     * @param {Object} responseReceived - The response from the last XHR, which is required to start the download.
     */
    const downloadTorrent = function (galleryDownloadButton, documentReceived, responseReceived) {
      // When this function runs, the reponse should have a status code of 200, and a document with the torrent data in
      // "document.body" from DOMparser should be received. There is one error that can happen before this, which is the
      // "unavailableTorrentError", and it is now checked for in the onload part of attemptDownloadStep(). This error
      // should only happen to redistributable torrents.
      const filename = decodeURIComponent(escape(responseReceived.responseHeaders.match(/filename="(.+)"$/m)[1]))
      if (shortcuts.apiTorrentDownloadEnabled) {
        downloadUsingApi(galleryDownloadButton, responseReceived.finalUrl, filename)
      } else {
        downloadUsingIframe(galleryDownloadButton, responseReceived.finalUrl)
      }
    }

    // Common step in H@H and archive download chains

    /**
     * Reads a gallery view page and proceeds to its archive selection page, or skips content warning first when needed.
     *
     * @type {onloadFunction}
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {Document} documentReceived - The parsed document returned by the last XHR.
     */
    const passGalleryView = function (galleryDownloadButton, documentReceived) {
      // Check whether the document received is actualy a gallery view page or a content warning page, which would need
      // to be skipped first by attempting this step again using the "view gallery" URL.
      if (xpathSelector(documentReceived, './/a[text() = "Get Me Outta Here"]') !== null) {
        const skipWarningUrl = xpathSelector(documentReceived, './/a[text() = "View Gallery"]').href
        attemptDownloadStep(galleryDownloadButton, skipWarningUrl, passGalleryView)
      } else {
        const archiveDownloadButton = xpathSelector(documentReceived, './/a[text() = "Archive Download"]')
        if (archiveDownloadButton === null) {
          // There is an error if the archive download link is not found. This should not happen, but is checked just in
          // case.
          handleError(galleryDownloadButton, 'unknownError', documentReceived.documentElement.outerHTML)
          return
        }
        const archiveSelectionUrl = archiveDownloadButton.getAttribute('onclick').match(/popUp\('(.+?)',/)[1]
        if (shortcuts.archiveDownloadType.includes('H@H')) {
          attemptDownloadStep(galleryDownloadButton, archiveSelectionUrl, selectTargetHath)
        } else {
          attemptDownloadStep(galleryDownloadButton, archiveSelectionUrl, selectTargetArchive)
        }
      }
    }

    // H@H download chain

    /**
     * Reads an archive selection page and sends form data to schedule a H@H download.
     *
     * @type {onloadFunction}
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {Document} documentReceived - The parsed document returned by the last XHR.
     */
    const selectTargetHath = function (galleryDownloadButton, documentReceived) {
      // Check whether the document received is actualy the archive selection page. #hathdl_form is used to check this.
      if (documentReceived.getElementById('hathdl_form') === null) {
        if (documentReceived.querySelector('form[name = "ipb_login_form"]')) {
          // A page with a login form will be served instead when the user is not logged in.
          handleError(galleryDownloadButton, 'notLoggedInError')
        } else {
          // The archive selection page was not served because the archiver is on "auto select" in the user's EH gallery
          // settings. This chain will have to be stopped because the user needs to use "manual select" instead.
          handleError(galleryDownloadButton, 'autoSelectHathError')
        }
        return
      }

      const hathDownloadType = shortcuts.archiveDownloadType.match(/H@H (\d+x|original)/)[1]
      let hathFormData
      // If a resample version is selected, test whether it is available before setting the form data.
      if (hathDownloadType !== 'original' &&
        xpathSelector(documentReceived, `.//a[text() = "${hathDownloadType}"]`) !== null) {
        hathFormData = `hathdl_xres=${hathDownloadType.slice(0, -1)}`
      } else {
        // Download the original version if it is selected or if the target resample version is not available.
        hathFormData = 'hathdl_xres=org'
      }
      const hathFormUrl = documentReceived.getElementById('hathdl_form').action
      attemptDownloadStep(galleryDownloadButton, hathFormUrl, confirmHathInstruction, hathFormData)
    }

    /**
     * Reads a H@H download confirmation page to determine whether the instruction was successful.
     *
     * It cannot detect downloads that failed for reasons other than non-qualification, because the author cannot
     * trigger these errors.
     *
     * @type {onloadFunction}
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {Document} documentReceived - The parsed document returned by the last XHR.
     */
    const confirmHathInstruction = function (galleryDownloadButton, documentReceived) {
      const bodyText = documentReceived.body.textContent
      if (bodyText.includes('Downloads should start processing within a couple of minutes')) {
        changeGalleryDownloadState(galleryDownloadButton, 'done')
      } else if (bodyText.includes('You must have a H@H client assigned to your account to use this feature')) {
        handleError(galleryDownloadButton, 'unqualifiedHathError')
      } else {
        handleError(galleryDownloadButton, 'unknownError', documentReceived.documentElement.outerHTML)
      }
    }

    // Archive download chain

    /**
     * Reads an archive selection page and sends form data to ask for a doggie bag archive download.
     *
     * @type {onloadFunction}
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {Document} documentReceived - The parsed document returned by the last XHR.
     */
    const selectTargetArchive = function (galleryDownloadButton, documentReceived) {
      // Check whether the document received is actualy the archive selection page. #hathdl_form is used to check this.
      if (documentReceived.getElementById('hathdl_form') === null) {
        if (documentReceived.querySelector('form[name = "ipb_login_form"]')) {
          // A page with a login form will be served instead when the user is not logged in.
          handleError(galleryDownloadButton, 'notLoggedInError')
        } else {
          // The archive selection page was not served because the archiver is on "auto select" in the user's EH gallery
          // settings. In this case, the arguments can be directly passed to the function for the next step.
          acquireArchiverAddress(galleryDownloadButton, documentReceived)
        }
        return
      }

      let archiveTypeButton
      let archiveFormData
      if (shortcuts.archiveDownloadType === 'resample archive') {
        archiveTypeButton = documentReceived.querySelector('input[value = "Download Resample Archive"]:not([disabled])')
        if (archiveTypeButton === null) {
          // Download the original archive if the resample archive is not available for the gallery.
          archiveTypeButton = documentReceived.querySelector('input[value = "Download Original Archive"]')
          archiveFormData = 'dltype=org&dlcheck=Download Original Archive'
        } else {
          archiveFormData = 'dltype=res&dlcheck=Download Resample Archive'
        }
      } else {
        archiveTypeButton = documentReceived.querySelector('input[value = "Download Original Archive"]')
        archiveFormData = 'dltype=org&dlcheck=Download Original Archive'
      }
      const archiveFormUrl = archiveTypeButton.closest('form').action
      attemptDownloadStep(galleryDownloadButton, archiveFormUrl, acquireArchiverAddress, archiveFormData)
    }

    /**
     * Reads a locating server or file processing page to acquire the archiver URL.
     *
     * @type {onloadFunction}
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {Document} documentReceived - The parsed document returned by the last XHR.
     */
    const acquireArchiverAddress = function (galleryDownloadButton, documentReceived) {
      // The archiver URL is always in the script element.
      const redirectScript = xpathSelector(documentReceived, './/script[contains(text(), "function gotonext()")]')
      if (redirectScript === null) {
        handleError(galleryDownloadButton, 'unknownError', documentReceived.documentElement.outerHTML)
        return
      }
      let archiverUrl = redirectScript.textContent.match(/document\.location = "(.+?)"/)[1]
      const delay = +redirectScript.textContent.match(/setTimeout\("gotonext\(\)", (\d+)\)/)[1]

      try {
        // Record the archiver hostname for steps after this, which will involve relative URLs.
        galleryDownloadButton.archiver = `http://${(new URL(archiverUrl)).hostname}`
      } catch (error) {
        // If the URL cannot be parsed, it must be the relative URL from a file processing page. Since file processing
        // happens after locating server, the archiver hostname has been recorded and the relative URL can be converted
        // to an absolute one.
        archiverUrl = galleryDownloadButton.archiver + archiverUrl
      }

      // Wait out the delay, which would be significant on a file processing page, before starting the next step,
      // because otherwise it may not be successful.
      setTimeout(function () {
        attemptDownloadStep(galleryDownloadButton, archiverUrl.replace('?autostart=1', ''), acquireArchiveAddress)
      }, delay)
    }

    /**
     * Reads a download ready page to acquire the download URL for the archive file.
     *
     * @type {onloadFunction}
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {Document} documentReceived - The parsed document returned by the last XHR.
     */
    const acquireArchiveAddress = function (galleryDownloadButton, documentReceived) {
      const downloadLink = xpathSelector(documentReceived, './/a[text() = "Click Here To Start Downloading"]')
      // Check whether the document received is actualy a download ready page, because a file processing page could be
      // served instead. The file processing step probably only happens when the archive takes time to recreate, and
      // it is just an additional step between locating server and download ready.
      if (downloadLink === null) {
        const redirectScript = xpathSelector(documentReceived, './/script[contains(text(), "function gotonext()")]')
        if (redirectScript !== null) {
          // In this case, the function for the last step, acquireArchiverAddress(), is designed to handle this file
          // processing page.
          acquireArchiverAddress(galleryDownloadButton, documentReceived)
        } else {
          handleError(galleryDownloadButton, 'unknownError', documentReceived.documentElement.outerHTML)
        }
        return
      }
      const downloadUrl = `${galleryDownloadButton.archiver}${(new URL(downloadLink.href)).pathname}?start=1`
      testDownloadHeaders(galleryDownloadButton, downloadUrl, downloadArchive)
    }

    /**
     * Downloads the archive file using GM.download().
     *
     * @type {onloadFunction}
     * @param {HTMLDivElement} galleryDownloadButton - The gallery download button associated with this download chain.
     * @param {undefined} documentReceived - The parsed document returned by the last XHR, which is not needed here.
     * @param {Object} responseReceived - The response from the last XHR, which is required to start the download.
     */
    const downloadArchive = function (galleryDownloadButton, documentReceived, responseReceived) {
      const filename = decodeURIComponent(escape(responseReceived.responseHeaders.match(/filename="(.+)"$/m)[1]))
      downloadUsingApi(galleryDownloadButton, responseReceived.finalUrl, filename)
    }

    // Page download

    /**
     * Changes the text and tooltip on the page download button.
     *
     * @param {string} targetState - 'idle', 'downloading', 'done', or 'failed'.
     * @param {number} [errorCount] - An optional integer for the number of galleries that ended up in terminal error
     * states. It is only required if the "targetState" is 'failed'.
     */
    const changePageDownloadState = function (targetState, errorCount) {
      const pageDownloadButton = document.getElementById('pageDownloadButton')
      // Set button text, button tooltip and page title in various states.
      switch (targetState) {
        case 'idle':
          if (shortcuts.pageRangeDownloadEnabled) {
            pageDownloadButton.value = 'Download Page(s)'
            setTooltip(pageDownloadButton, 'Download all galleries from this page onwards until the last page by ' +
              'automatically starting gallery downloads, unless errors occur. The number of concurrent downloads is ' +
              `limited to ${shortcuts.pageDownloadNumber} per tab`)
          } else {
            pageDownloadButton.value = 'Download This Page'
            setTooltip(pageDownloadButton, 'Download all galleries on this page by automatically starting gallery ' +
              `downloads. The number of concurrent downloads is limited to ${shortcuts.pageDownloadNumber} per tab`)
          }
          if (inPageDownloadMode) {
            document.title = '❙❙ ' + originalTitle
          } else {
            document.title = originalTitle
          }
          break
        case 'downloading':
          pageDownloadButton.value = 'Stop Page Download'
          setTooltip(pageDownloadButton, 'The master script is currently automatically downloading all galleries on ' +
            'this page. Press this button to stop this process, but running downloads are still allowed to finish.')
          document.title = '⤓ ' + originalTitle
          break
        case 'done':
          pageDownloadButton.value = 'Page Downloaded'
          setTooltip(pageDownloadButton, 'All galleries on this page have been downloaded')
          document.title = '✓ ' + originalTitle
          break
        case 'failed':
          pageDownloadButton.value = `${errorCount} Unavailable/Failed`
          setTooltip(pageDownloadButton, 'The master script has tried to download all galleries on this page, ' +
            'but at least some of them failed and hence require your attention')
          document.title = '✗ ' + originalTitle
      }

      if (targetState === 'downloading') {
        inPageDownloadMode = true
        if (shortcuts.downloadProtectionEnabled) {
          startDownloadProtection()
        }
      } else if (inPageDownloadMode) {
        // When the state is set to a terminal state, the page download mode is not necessarily active.
        inPageDownloadMode = false
        if (shortcuts.downloadProtectionEnabled) {
          endDownloadProtection()
        }
        if (targetState === 'failed') {
          alert('The master script has tried to download all galleries on this page, but at least some of them ' +
            'failed and hence require your attention.')
        } else if (targetState === 'done' && shortcuts.pageRangeDownloadEnabled) {
          schedulePageDownload()
        }
      }
    }

    /**
     * Activates gallery download buttons in the "idle" state to automatically start gallery downloads.
     *
     * This function can be called from a gallery download button as an event handler, and also from
     * changeButtonState().
     *
     * Buttons in "unavailable" and "failed" states will not be retried by this function, because these states can
     * persist for a while. However, it is easy to add an option in the future to bring back the ability to
     * automatically retry buttons in the "unavailable" state.
     *
     * @type {clickEventHandler}
     * @param {MouseEvent} clickEvent - The event object passed to this event handler on click.
     */
    const attemptPageDownload = function (clickEvent) {
      // When the page download button is clicked, do nothing if the page has been completed. This makes it possible to
      // update this button after page completion is declared.
      if (typeof clickEvent !== 'undefined' && checkPageCompletion()) {
        return
      }

      if (typeof clickEvent === 'undefined') {
        // If this function is called without the "clickEvent" argument, it must have been called automatically from
        // changeButtonState() after a download has reached a terminal state in the page download mode. In this case,
        // start one gallery download to fill in the gap if possible.
        const nextIdleButton = document.body.querySelector('.galleryDownloadButton.idle')
        // When there are download attempts still running but no button left in the "idle" state, checkPageCompletion()
        // will not declare completion and hence this function will still run. Therefore, it needs to check whether
        // there is still a "idle" button to be clicked. Also, it should not start a download when the concurrent
        // download slots are full, which could happen if the user has manually started some downloads on the same page.
        if (nextIdleButton !== null && concurrentDownloadsRunning < shortcuts.pageDownloadNumber) {
          nextIdleButton.click()
        }
      } else {
        // If this function is called from the button, start or stop the page download mode.
        if (!inPageDownloadMode) {
          // If the page download mode is not already active when this button is clicked, activate this mode and start
          // the set number of concurrent downloads if possible.
          changePageDownloadState('downloading')
          const idleButtons = document.body.querySelectorAll('.galleryDownloadButton.idle')
          // Fewer or no downloads will be started if there are already some downloads running on this page when this
          // mode is entered.
          const numberToStart = Math.min(shortcuts.pageDownloadNumber - concurrentDownloadsRunning, idleButtons.length)
          for (let i = 0; i < numberToStart; ++i) {
            idleButtons[i].click()
          }
        } else {
          // If the page download mode is already active when this button is clicked, deactivate this mode. Running
          // downloads will still finish, but further downloads will not be started.
          changePageDownloadState('idle')
        }
      }
    }

    /**
     * Checks whether all galleries on the current gallery list page have been attempted.
     *
     * This function is only applicable when the page download option has been enabled. It will be called every time a
     * gallery download reaches a terminal state, and when the page download button is clicked. Since this function only
     * checks the number of gallery download buttons, page completion will also be safely declared on a gallery list
     * page which has been emptied by filters.
     *
     * @returns {boolean} true if the current page has been completed; otherwise false.
     */
    const checkPageCompletion = function () {
      if (document.body.querySelectorAll('.galleryDownloadButton.idle').length > 0) {
        return false
      }
      // Only declare page completion when there is also no button in the "loading" or "downloading" state, because
      // these buttons may not necessarily succeed.
      const runningCount = document.body.querySelectorAll('.galleryDownloadButton.loading, ' +
        '.galleryDownloadButton.downloading').length
      if (runningCount > 0) {
        return false
      }

      // Start declaring page completion after checking for the number of buttons in the states above.

      // Check whether there are failed downloads that require the user's attention.
      const errorCount = document.body.querySelectorAll('.galleryDownloadButton.unavailable, ' +
        '.galleryDownloadButton.failed').length
      if (errorCount === 0) {
        changePageDownloadState('done')
      } else {
        changePageDownloadState('failed', errorCount)
      }
      return true
    }

    /**
     * Records the next page to download and goes to this page to start the page download where possible.
     */
    const schedulePageDownload = async function () {
      // Check whether there is a next page by trying to select a clickable next page button. This button is always
      // there, but it only has the "onclick" attribute and an anchor child element when there is a next page.
      const nextPage = document.querySelector('table.ptt td:last-child[onclick]')
      if (nextPage === null) {
        return
      }

      // Record the URL of the next page to be downloaded using the URL of the current page as key. This should have no
      // negative effect if this key already exists. Then go to the next page after updating the userscript storage.
      values.useAutomatedDownloads.pagesToDownload[windowUrl] = nextPage.firstElementChild.href
      await api.setValue('values', JSON.stringify(values))
      nextPage.click()
    }

    /**
     * Starts the page download if the current page was marked for it, and updates the userscript storage.
     */
    const continuePageDownload = async function () {
      const pagesToDownload = values.useAutomatedDownloads.pagesToDownload
      if (!shortcuts.pageDownloadEnabled || !shortcuts.pageRangeDownloadEnabled ||
        Object.keys(pagesToDownload).length === 0) {
        return
      }

      for (const key of Object.keys(pagesToDownload)) {
        if (windowUrl === pagesToDownload[key]) {
          delete pagesToDownload[key]
          // When the current page is empty due to filters but there is a next page available, clicking the page
          // download button below will directly start schedulePageDownload(). Therefore, it is safer to wait for the
          // storage update to finish before clicking the button, because otherwise schedulePageDownload() and this
          // function may save different versions of the same object property.
          await api.setValue('values', JSON.stringify(values))
          document.getElementById('pageDownloadButton').click()
        }
      }
    }

    /**
     * Disables all pointer events on buttons and links in gallery lists and makes galleries open in new tab.
     */
    const startDownloadProtection = function () {
      const downloadProtectionStyles = `
        /* base gallery list */
        #nb, #openConfigButton, #additionalFiltersButton, #dms select, table.ptt, table.ptb, p.ip > a, div.dp > a,
        input[type = "submit"],
        /* search index only */
        input[value = "Clear Filter"], input[type = "file"],
        /* favorite list only */
        div.fp, input[value = "Clear"], a[href *= "inline_set=fs_"], select[name = "ddact"],
        /* gallery toplists only */
        #ot > a,
        /* uploader link in four display modes */
        td.glhide > div > a, .gl3e > .ir + div > a
        { pointer-events: none; } `
      appendStyleText(document.head, 'downloadProtectionStyles', downloadProtectionStyles)
      if (!settings.openGalleriesSeparately.featureEnabled) {
        openGalleriesSeparately()
      }
    }

    /**
     * Reverses the effects of startDownloadProtection().
     */
    const endDownloadProtection = function () {
      document.head.removeChild(document.getElementById('downloadProtectionStyles'))
      // Reverse the effects of openGalleriesSeparately() when it is not enabled in the settings.
      if (!settings.openGalleriesSeparately.featureEnabled) {
        const galleryLinks = document.body.querySelectorAll('.gl3m.glname > a, .gl3c.glname > a, .gl1e > div > a, ' +
          '.gl2e > div > a, .gl1t > a, .gl4t.glname > div > a, .gl3t > a')
        for (const galleryLink of galleryLinks) {
          galleryLink.onclick = null
        }
      }
    }

    addShortcutStyles()
    addDownloadButtons()
    continuePageDownload()
  }

  /**
   * Opens galleries in new tab by default from all types of gallery lists.
   */
  const openGalleriesSeparately = function () {
    if (pageType !== 'gallery list') {
      return
    }
    let galleryLinks
    switch (displayMode) {
      case 'minimal':
      case 'minimal+':
        galleryLinks = document.body.querySelectorAll('.gl3m.glname > a')
        break
      case 'compact':
        galleryLinks = document.body.querySelectorAll('.gl3c.glname > a')
        break
      case 'extended':
        galleryLinks = document.body.querySelectorAll('.gl1e > div > a, .gl2e > div > a')
        break
      case 'thumbnail':
        // In this display mode, the anchors on gallery titles are located differently in the DOM tree between the
        // search index (.gl1t > a) and the favorite list (.gl1t > .gl4t.glname.glft > div > a), but the anchors on
        // gallery thumbnails are not. Therefore, three selectors are needed in total to select all links.
        galleryLinks = document.body.querySelectorAll('.gl1t > a, .gl4t.glname > div > a, .gl3t > a')
    }
    for (const galleryLink of galleryLinks) {
      galleryLink.onclick = function (anchorEvent) {
        anchorEvent.preventDefault()
        window.open(galleryLink.href)
      }
      if (settings.openGalleriesSeparately.directMpvEnabled) {
        galleryLink.href = galleryLink.href.replace(/\/g\//, '/mpv/')
      }
    }
  }

  /**
   * Adds buttons to the bottom right corner which will automatically scroll the page to the very top or bottom.
   *
   * It might be more convenient to put these buttons in other places as well, but at the moment they are only added to
   * the bottom right corner because this is where websites usually place this kind of button.
   */
  const addJumpButtons = function () {
    // This feature does not run in the MPV, because it can cause accidents and also block the thumbnails when
    // relocateMpvThumbnails() is used. These buttons also do not seem necessary in HV, which have short pages.
    if (pageType === 'MPV view' || pageType === 'HentaiVerse') {
      return
    }
    let jumpButtonStyles
    // "font-size" in the styles below needs "!important" on the gallery management page. In general, the buttons
    // automatically blend in quite well.
    if (settings.addJumpButtons.jumpButtonStyle === 'fade-in circular buttons') {
      jumpButtonStyles = `
        #jumpButtonHost { height: 23vh; width: 12vh; position: fixed; right: 2vh; bottom: 2vh; z-index: 3; opacity: 0;
          transition-duration: 0.3s; }
        #jumpButtonHost:hover { opacity: 1; }
        #jumpToTopButton, #jumpToBottomButton { height: 10vh; width: 10vh; border-radius: 5vh; margin: 0.5vh;
          box-shadow: 0 0 1vh 0 rgba(0, 0, 0, 0.6); font-size: 6vh !important; line-height: 6vh; }`
    } else if (settings.addJumpButtons.jumpButtonStyle === 'slide-in rectangular buttons') {
      jumpButtonStyles = `
        #jumpButtonHost { height: 20vh; width: 10vw; position: fixed; right: -8.5vw; bottom: 2vh; z-index: 3;
          box-shadow: 0 0 1vh 0 rgba(0, 0, 0, 0.6); transition: 0.3s; }
        #jumpButtonHost:hover { right: -3px; transition: 0.3s; }
        #jumpToTopButton, #jumpToBottomButton { height: 10vh; width: 10vw; margin: auto; font-size: 6vh !important;
          line-height: 6vh; }
        #jumpToTopButton { border-radius: 3px 0 0 0; }
        #jumpToBottomButton { border-radius: 0 0 0 3px; }`
    }

    const jumpBehaviour = settings.addJumpButtons.jumpBehaviourStyle === 'smoothly' ? 'smooth' : 'auto'
    const jumpToTop = function () {
      window.scrollTo({ top: 0, behavior: jumpBehaviour })
    }
    const jumpToBottom = function () {
      const scrollHeight = (document.scrollingElement.scrollHeight || document.documentElement.scrollHeight ||
        document.body.scrollHeight)
      window.scrollTo({ top: scrollHeight, behavior: jumpBehaviour })
    }

    appendStyleText(document.head, 'jumpButtonStyles', jumpButtonStyles)
    const jumpButtonHost = document.createElement('div')
    jumpButtonHost.id = 'jumpButtonHost'
    jumpButtonHost.appendChild(createDmsButton('jumpToTopButton', '⭱', jumpToTop))
    jumpButtonHost.appendChild(createDmsButton('jumpToBottomButton', '⭳', jumpToBottom))
    document.body.appendChild(jumpButtonHost)
  }

  /**
   * Transform URLs to external websites in gallery comments to clickable links.
   *
   * This includes all URLs which do not appear as links by default. EHWiki, HV and two other EH domains are also
   * considered external by the site due to their domain names, and hence benefit from this feature. However, using this
   * feature is potentionally risky for users who cannot identify malicious links.
   *
   * This feature only transforms URLs that include the protocol part e.g., "https://", because otherwise it is too
   * difficult to detect valid URLs.
   */
  const parseExternalLinks = function () {
    if (pageType !== 'gallery view') {
      return
    }

    /**
     * Replaces the first plain text occurrence of a URL with an anchor that shows and goes to this URL.
     *
     * @param {string} text - The text body in which at least one instance of the target URL exists.
     * @param {string} url - The target URL to be found and converted.
     */
    const replaceUrlOnce = function (text, url) {
      let searchedSubstring = ''
      let searchSubstring = text
      while (true) {
        const offset = searchSubstring.indexOf(url)
        // Break the infinite loop when the target URL cannot be found. This probably only happens when the URL should
        // not be parsed due to the conditions below.
        if (offset === -1) {
          return text
        }
        // Test what is just before this instance of the target URL to check whether it is already inside an anchor tag.
        if (!/="|">/.test(searchSubstring.substring(offset - 2, offset))) {
          // Emphasise the domain like on the forums, unless the domain also belongs to EH.
          const domainEmphasis = `[<strong>${(new URL(url)).hostname}</strong>]`
          if (/(?:repo.|upload.)e-hentai\.org|ehwiki\.org|hentaiverse\.org/.test(domainEmphasis)) {
            return searchedSubstring + searchSubstring.replace(url, `<a href="${url}">${url}</a>`)
          } else {
            return searchedSubstring + searchSubstring.replace(url, `${domainEmphasis} <a href="${url}">${url}</a>`)
          }
        }
        searchedSubstring = searchedSubstring + searchSubstring.substring(0, searchSubstring.indexOf(url) + 1)
        searchSubstring = searchSubstring.substring(searchSubstring.indexOf(url) + 1)
      }
    }

    const comments = document.getElementsByClassName('c6')
    for (const comment of comments) {
      // Replace the "<br>" HTML tag to make the regex below easier. It is difficult to parse HTML with regex anyway.
      const formattedHTML = comment.innerHTML.split('<br>').join('\n')
      // The regex used to find URLs below is very simple but good enough so far. It tries to replicate how the site
      // will delimit URLs: In addition to spaces and line breaks, the symbols "[" / "]" / "," / "." / ";" / ":"
      // followed by a space or line break also delimit a URL; other symbols from the US international keyboard layout
      // would be treated as part of the URL by the site, such as other types of brackets. "">" and "</" are used to
      // delimit URLs in tags or surrounded by tags, respectively.
      const urls = formattedHTML.match(/https?:\/\/\S+?(?=[[\],.;:]?(?:\s|$)|">|<\/)/gm)
      if (urls === null) {
        continue
      }
      // Sort the URLs found from long to short so that the longer URLs will be replaced first, because otherwise a URL
      // that includes another shorter URL will not be processed correctly.
      const orderedUrls = urls.sort((a, b) => b.length - a.length)
      for (const url of orderedUrls) {
        // Firefox still does not seem to support regex lookbehind.
        if (/(?:repo|upload)\.e-hentai\.org/.test(url) || !/(?:e-hentai|exhentai|ehgt)\.org/.test(url)) {
          comment.innerHTML = replaceUrlOnce(comment.innerHTML, url)
        }
      }
    }
  }

  /**
   * Removes the filename tooltips on the main images in the MPV.
   *
   * The tooltips on the thumbnail images are kept because they show page numbers and are hence useful for navigation.
   */
  const removeMpvTooltips = function () {
    if (pageType !== 'MPV view') {
      return
    }

    /**
     * Observes subtree child list changes under the main image pane and removes tooltips when image anchors are loaded.
     *
     * This NodeList will be loaded in each mutation: [a, text, div.mi1]
     *
     * @param {} mutations
     */
    const removeImageTooltips = function (mutations) {
      for (const mutation of mutations) {
        // Do nothing when images get dynamically removed.
        if (mutation.addedNodes.length === 0) {
          continue
        }
        for (const addedNode of mutation.addedNodes) {
          // Find the image anchor and remove the title attribute from div.mi0 > a > img[id ^= "imgsrc_"].
          if (addedNode.nodeName === 'A') {
            const mainImage = addedNode.querySelector('img[id ^= "imgsrc_"]')
            if (mainImage !== null) {
              mainImage.removeAttribute('title')
            }
          }
        }
      }
    }
    const mpvObserver = new MutationObserver(removeImageTooltips)
    mpvObserver.observe(document.getElementById('pane_images_inner'), { childList: true, subtree: true })
  }

  /**
   * Extends the availability of the daily dawn reward event so that it can be collected from any EH-related page.
   *
   * This makes the event available on the entire gallery system, the forums and HV. It is otherwise only available in
   * EH gallery view and on the news page. The EH wiki is the only place that is not supported, but that is only because
   * the script is not enabled on the EH wiki in general. To minimise intrusion, this feature does not give a
   * notification when a daily reward is collected.
   */
  const collectDawnReward = function () {
    // These two types of pages would trigger the dawn event, so this function does not need to run.
    if (pageType === 'gallery view' && windowUrl.includes('e-hentai.org')) {
      return
    } else if (windowUrl === 'https://e-hentai.org/news.php') {
      return
    }
    // Check the time elapsed since the time the last reward that was collected by this feature became available, and
    // only start a collection when the time elapsed is greater than one day. "lastCollectedReward" below defaults to
    // zero, so this function will start a collection when it has never done it before.
    const currentDateTime = new Date()
    if (currentDateTime - values.collectDawnReward.lastCollectedReward <= 86400000) {
      return
    }

    // The XHR will not retry on network or HTML error, because the error may persist for a while and the user cannot
    // cancel this endless retry process. It is not a problem since it can be triggered in other tabs afterwards.
    const xhrDetails = {
      method: 'GET',
      synchronous: false,
      timeout: 60000,
      url: 'https://e-hentai.org/news.php',
      onload: function (response) {
        if (response.status === 200) {
          // Record this collection by the time this reward became available i.e., the date at 00:00 GMT.
          const currentRewardSlot = Date.UTC(currentDateTime.getUTCFullYear(), currentDateTime.getUTCMonth(),
            currentDateTime.getUTCDate())
          values.collectDawnReward.lastCollectedReward = currentRewardSlot
          api.setValue('values', JSON.stringify(values))
        }
      },
      ontimeout: function (response) {
        collectDawnReward()
      }
    }
    api.xmlHttpRequest(xhrDetails)
  }

  // Helper functions --------------------------------------------------------------------------------------------------

  /**
   * Produces a "text/css" style element and appends it to a host element as a child node.
   *
   * @param {HTMLElement} host - The element under which the style element will be added as a child node.
   * @param {string} [id] - An optional id that can be assigned to the style element.
   * @param {string} text - The text content of the style element, which should be the CSS styles.
   * @returns {HTMLStyleElement} The newly created style element.
   */
  const appendStyleText = function (host, id, text) {
    const styleText = document.createElement('style')
    styleText.type = 'text/css'
    if (typeof id !== 'undefined') {
      styleText.id = id
    }
    styleText.textContent = text
    host.appendChild(styleText)
    return styleText
  }

  /**
   * Creates a button that uses the same visual style as the display mode selector in gallery lists.
   *
   * @param {string} [id] - An optional id that can be assigned to the button input element.
   * @param {string} text - The text content to be shown on the face of the button.
   * @param {clickEventHandler} onclick - The function that will run when this button is clicked.
   * @param {string} [tooltip] - An optional tooltip to be set on this button.
   * @returns {HTMLInputElement} The newly created button input element.
   */
  const createDmsButton = function (id, text, onclick, tooltip) {
    const dmsButton = document.createElement('input')
    dmsButton.type = 'button'
    if (typeof id !== 'undefined') {
      dmsButton.id = id
    }
    dmsButton.className = 'dmsStyleButtons'
    dmsButton.value = text
    dmsButton.addEventListener('click', onclick)
    dmsButton.addEventListener('click', () => { dmsButton.blur() })
    if (typeof tooltip !== 'undefined') {
      setTooltip(dmsButton, tooltip)
    }
    return dmsButton
  }

  /**
   * Sets a tooltip on an element.
   *
   * If this element is a button input element, then whether a tooltip will actually be added depends on a setting.
   *
   * @param {HTMLElement} element - The element on which the tooltip will be set.
   * @param {string} tooltip - The tooltip to be set. An empty string will remove the tooltip.
   */
  const setTooltip = function (element, tooltip) {
    if (tooltip === '') {
      element.removeAttribute('title')
    } else {
      if (element.type === 'button') {
        if (settings.script.buttonTooltipEnabled) {
          element.title = tooltip
        }
      } else {
        element.title = tooltip
      }
    }
  }

  /**
   * Adds a link button to a navigation bar.
   *
   * @param {HTMLDivElement} bar - The navigation bar, which should be a division element.
   * @param {string} text - The visible text content of the link.
   * @param {string} link - The destination URL of the link.
   */
  const addNavigationButton = function (bar, text, link) {
    const button = document.createElement('a')
    button.text = text
    button.href = link
    if (link === 'https://hentaiverse.org/') {
      button.setAttribute('onclick', 'popUp("https://hentaiverse.org/", 1250, 720); return false')
    }
    const buttonHost = document.createElement('div')
    buttonHost.appendChild(button)
    bar.appendChild(buttonHost)
  }

  /**
   * Selects one element in a document by evaluating an XPath expression.
   *
   * @param {Document} contextDocument - The document whose child nodes will be searched to select the target element.
   * @param {string} xpath - The XPath selector expression.
   * @returns {(HTMLElement|null)} The target element if it is successfully found; otherwise null.
   */
  const xpathSelector = function (contextDocument, xpath) {
    return contextDocument.evaluate(xpath, contextDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE,
      null).singleNodeValue
  }

  /**
   * Runs a function once after the "DOMContentLoaded" event fires.
   *
   * @param {Function} functionToRun - The function to be run, which should not require any parameter.
   */
  const scheduleForInteractive = function (functionToRun) {
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', functionToRun, { once: true })
    } else {
      functionToRun()
    }
  }

  /**
   * Downloads data as a plain text file.
   *
   * @param {BlobPart} data - The data, which should usually be a string, to be included in the text file.
   * @param {string} filename - The filename with or without the ".txt" extension of the text file to be downloaded.
   */
  const downloadTextData = function (data, filename) {
    const textFile = new Blob([data], { type: 'text/plain;charset=utf-8' })
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(textFile)
    downloadLink.download = /^.*?\.txt$/.test(filename) ? filename : `${filename}.txt`
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    setTimeout(() => { URL.revokeObjectURL(downloadLink.href) }, 1000)
  }
})()
