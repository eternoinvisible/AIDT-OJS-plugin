# AITD Plugin for OJS

## Description

This plugin integrates the **AI Transparency Declaration (AITD) Generator** into Open Journal Systems (OJS). It provides authors and editors with a tool to generate manuscript-ready AI transparency statements in accordance with the AITD v1.1 framework.

## Features

- Generate AI Transparency Declaration statements
- Copy to clipboard (with fallback for restrictive CSP environments)
- Download as HTML, XML, or PDF
- Bilingual interface (English/Spanish)
- Fully client-side processing (no data sent to servers)
- Configurable navigation menu integration

## Installation

1. Download the plugin from the Plugin Gallery or install manually.
2. Place the `aitdPlugin` folder in `plugins/generic/`.
3. Go to **Settings > Website > Plugins** and enable the plugin.
4. Configure the plugin settings (optional).

## Usage

Once enabled, a new page will be available at:

https://your-journal.com/index.php/your-journal/aitd


A link to this page can be added to the navigation menu via the plugin settings.

## Requirements

- OJS 3.3.0 or later
- PHP 7.4 or later

## License

GNU AGPL v3.0

## Credits

Developed by Sergio Santamarina and Carlos Authier based on the AITD model v1.1.
