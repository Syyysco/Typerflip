<div align="center">

  **LANGUAGE**: [Spanish](LÉEME.md)  ·  English
  
  # TYPERFLIP
  Format your ideas for social media
  
  [![License](https://img.shields.io/badge/License-Restricted%20Personal%20Use-BE2642)](https://github.com/Syyysco/Typerflip/blob/main/LICENSE)
  [![Website](https://img.shields.io/website?url=https%3A%2F%2Fsyyysco.github.io%2FTyperflip%2F)](https://syyysco.github.io/Typerflip/)
  [![GitHub issues](https://img.shields.io/github/issues/Syyysco/Typerflip)](https://github.com/Syyysco/Typerflip/issues)
  [![GitHub last commit](https://img.shields.io/github/last-commit/Syyysco/Typerflip?colorB=319e8c)](https://github.com/Syyysco/Typerflip/commits)
  
  [View Demo](https://syyysco.github.io/Typerflip/)  ⊶  [Report a Bug](https://github.com/Syyysco/Typerflip/issues)  ⊷  [Request a Feature](https://github.com/Syyysco/Typerflip/issues)
  
  <br>
  
  <img src="/assets/img/screenshots/pc-mobile-preview.png" alt="Typerflip website quick view"><br>
</div>

> Typerflip arrives to solve a current problem across most platforms: users are forced to create posts, descriptions, bios or other content that often conveys nothing — lacking personality and professionalism — and above all creates friction between the messenger and the receiver. The idea is simple: make the message easier to understand and avoid losing the user's interest.
<br>

## TABLE OF CONTENTS
- [Key features](#key-features)
- [Quick start](#quick-start)
- [Local installation](#local-installation)
  - [Simple method](#simple-method)
  - [Using npm](#using-npm)
- [Formatting guide](#formatting-guide)
- [Project structure](#project-structure)
- [Developer information](#developer-information)
    - [Project languages](#project-languages)
    - [Bug tracking and TODOs](#bug-tracking-and-todos)
- [Performance](#performance)
    - [Mobile](#mobile)
    - [Desktop](#desktop)
- [Color palette](#color-palette)
- [Contributing](#contribute)
- [License](#license)
  
<br>

## KEY FEATURES

- **Real-time formatting** - See changes as you type
  > - Markdown-like syntax
  > - 8 formatting types ([See](#formatting-guide))
  > - Changes are reflected practically instantly.
- **Cross-platform compatibility** - Checks character limits for each social network
  > - Twitter/X
  > - LinkedIn
  > - Instagram
  > - Facebook
  > - Threads
  > - Discord
  > - Reddit
  > - TikTok
  > - YouTube
  > - Mastodon
- **Auto-save** - Never lose your work
- **Content analysis** - Useful control metrics
  > - Overall compatibility
  > - Paragraphs
  > - Hashtags
  > - Mentions
  > - Emojis
  > - Reading time
- **Symbols & emojis** - Quick access to special characters
- **Template system** - Save and reuse your favorite formats
  > - Default templates for posts and bios
  > - System to create and edit custom templates

<br>

## QUICK START

1. **Write or paste** your text into the editor
2. Use the **formatting shortcuts** ([See](#formatting-guide))
3. Check **compatibility** with each platform
4. **Copy**, **export**, or **save** your formatted text

> In the following comparison you can see the difference between a regular LinkedIn post (left) and the same post using Typerflip (right).
<img src="/assets/img/screenshots/linkedin-preview.png" alt="Text comparison on Linkedin using Typerflip"><br>

<br>

## LOCAL INSTALLATION
> For any local run, clone the repository and be inside its folder:
> ```bash
> # Clone the repository and move to its folder
> git clone https://github.com/Syyysco/Typerflip.git && cd Typerflip
> ```
> Then you can choose one of the following methods:

### SIMPLE METHOD
```bash
# Start the server
python3 -m http.server 8080 --bind 0.0.0.0

# Open the browser at the local URL (from terminal) or paste the URL in the browser
chrome http://localhost:8080 # for chrome
edge http://localhost:8080   # for microsoft edge
```

### USING NPM
```bash
# Install dependencies (won't install system-wide)
npm install

# Build and run
npm run build
```

> [!Note]
> - Once the build is created with npm run build it is not necessary to rebuild it to launch the server. You can start the server by running npm run start.
> - It is possible to change the default port, automatic browser opening, and other settings from the file [`config/build.config.json`](config/build.config.json):
>   ```json
>   "server": {
>      "enabled": true,
>      "port": 8080
>   },
>   "autoOpenBrowser": true
>   ```

<br>

## FORMATTING GUIDE
| Syntax	                      | Result                          |
|---------------------------------|---------------------------------|
| `**Text**`                      | Bold                            |
| `*Text*`                        | Italic                          |
| `***Text***`                    | Bold italic                     |
| `1. Text, 2. Text...`           | Numbered list (𝟭.)              |
| `- Text`                        | Simple list (•)                 |
| `+ Text`                        | Highlighted list (●)            |
| `` `code` `` or ` ```block``` ` | Inline code / code block (𝚖𝚘𝚗𝚘) |
| `.. Text`, `... Text`, etc.     | Indentation (tabulation)        |

<br>

## PROJECT STRUCTURE
```rb
typerflip/
├── assets/            # Static resources
│   ├── brand/         # Identity resources
│   ├── fonts/         # Fonts
├── css/               # Modular styles
│   ├── base/          # Base styles
│   ├── components/    # Components
│   ├── layout/        # Layout container
│   ├── responsive/    # Media queries
│   ├── utils/         # Utilities
│   └── main.css/      # Module imports
├── js/                # JavaScript logic
│   ├── components/    # Web components
│   ├── config/        # Configuration
│   ├── data/          # Modular data
│   ├── lib/           # Internal libraries
│   ├── services/      # Services
│   ├── store/         # Dynamic variables
│   ├── utils/         # Utilities
│   └── app.js/        # Main flow
├── config/            # General configuration
│   └── build.config.json # Build configuration for npm
├── build.js           # Entry point for npm build
├── package.json       # Modules required for npm
├── manifest.json      # Manifest
├── browserconfig.xml  # Tiles & PWA
├── sitemap.xml        # SEO
├── robots.txt         # Indexing instructions
└── index.html         # Entry point
```
> Files not listed are auxiliary resources (images, specific configurations, or internal scripts).

<br>

## DEVELOPER INFORMATION
### PROJECT LANGUAGES
> [!Important]
> The app UI is written in Spanish. Below are concrete details about the language of each project element.

- **Documentation languages available:** English and Spanish (2)
- **Main language of the site (text strings, HTML lang, etc.):** Spanish
- **Language for variables, functions, methods, etc. (CSS, HTML, JS ..):** English
- **Language for comments:** Spanish
- **Language for JSDoc:** English

### BUG TRACKING AND TODOs
- **Development notes:** The file [`DEVELOPMENT.md`](DEVELOPMENT.md) contains known issues so far and tasks / future ideas.
- **ID/Reference system:** Problematic, to-be-solved, experimental or provisional snippets (identified) are commented in the source code with a short description and an ID/reference, and later added to the file [`DEVELOPMENT.md`](DEVELOPMENT.md) for searching with utilities such as `grep`.
- **Debug mode available:** The file [`js/lib/debugSystem.js`](js/lib/debugSystem.js) handles most logs and provides more complete error, warning and info output.

    - The traces/logs shown in the console by the debug system will contain relevant information, including the error reference, which will make it easier to search for it within the project.
    - It can be enabled/configured from the file [`js/config/constants.js`](js/config/constants.js). The `APP_CONFIG` object contains the entire application configuration, including debug mode (disabled by default):
        ```js
        DEBUG: {
        ENABLED: false,
        SHOW_TIMESTAMP: true,
        LOG_TO_CONSOLE: true,
        SHOW_STACK_TRACE: false
        },
        ```
    - Basic usage is as follows (also commented at the end of the main file):
        ```js
        // Using the global function
        debug('error', '001ac5', 'Database connection failed', { host: 'localhost', port: 5432 });
        debug('warning', '002bd7', 'API rate limit approaching', { current: 95, limit: 100 });
        debug('info', '003ce9', 'User authentication successful', { userId: 12345 });
        debug('success', '004df1', 'File upload completed', { filename: 'document.pdf', size: '2.3MB' });

        // Using specific methods
        debugSystem.error('005ef3', 'Validation failed for user input', myObject);
        debugSystem.warning('006fg5', 'Memory usage high', { usage: '85%', threshold: '80%' });
        debugSystem.info('007gh7', 'Cache refreshed successfully');
        debugSystem.success('008hi9', 'Backup completed');

        // Utilities
        console.log('Debug Stats:', debugSystem.getStats());
        debugSystem.clear(); // Clear logs
        debugSystem.disable(); // Disable debug
        ```
        > The required parameters are:
        > **Error type:** error, warning, info, success. If left empty, info will be used as default.
        > **Trace reference:** Unique identifier for the trace (ensure it does not already exist). Example: 005tr1.
        > **Message:** Text that will be shown in the console trace. Plain text only (not Object, HTMLElement, etc).
        > **Additional data:** Extra information such as an Object, HTMLElement, etc.

<br>

## PERFORMANCE
> Lighthouse performance audits show a delay on the first meaningful paint which impacts the overall performance score. Even if this doesn't translate directly to perceived usability in all cases, it can affect correct indexing and SEO. This is documented in the [development notes](DEVELOPMENT.md) and is caused by the initial layout calculation. A fix is planned soon.

### DESKTOP
| Metric                 | Score      |
|------------------------|------------|
| Performance            | 82/100     |
| Accessibility          | 94/100     |
| Best Practices         | 100/100    |
| SEO                    | 100/100    |

<img src="/assets/img/screenshots/lighthouse-desktop.png" alt="Insights of Typerflip web app on desktop" align="center"><br>

### MOBILE
> On mobile, performance is affected on the first load due to initial layout calculations (JavaScript) combined with monitoring viewport changes to determine if adjustments are needed. This will be fixed soon.
| Metric                 | Score      |
|------------------------|------------|
| Performance            | 59/100     |
| Accessibility          | 92/100     |
| Best Practices         | 100/100    |
| SEO                    | 100/100    |

<img src="/assets/img/screenshots/lighthouse-mobile.png" alt="Insights of Typerflip web app on mobile" align="center"><br>

<br>

## COLOR PALETTE

| Color         | Hex       | Uso               |
|---------------|-----------|-------------------|
| Black         | `#000000` | Main background   |
| Licorice      | `#1D0D12`  | Primary accent    |
| Dark Gunmetal | `#1B212C` | Secondary accent  |
| Ghost White   | `#FAFAFF` | Primary text      |
| Independence  | `#4A5568` | Accent text       |

<img src="/assets/img/screenshots/color-palette.png" alt="Color palette used on Typerflip" align="center"><br>

<br>

## CONTRIBUTE

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

> [!Note]
> For changes or new features remember to add clear instructions. For experimental features or various bugs it is important to document them following the current reference system (both in source code and in the [`DEVELOPMENT.md`](DEVELOPMENT.md) file).

<br>

## LICENSE

This project is under a personal use license. This prohibits any commercial use, inclusion in external projects and redistribution without the express consent of the author. See [LICENSE](LICENSE) for more details.


---

<br>

<div align="center">

  <img src="/assets/img/watermark.png" alt="Sysco logo" width="150"><br>

  Made with ♥ by Sysco

  <img src="/assets/img/profile_banner.png" alt="Sysco logo" width="50"><br>

</div> 