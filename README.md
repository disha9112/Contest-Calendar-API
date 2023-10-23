# Contest-Calendar-API

A script to add upcoming contests to your Google Calendar, made using the CLIST API and Apps Script. It currently supports the correct fetching and storage of LeetCode and Codeforces contest events.

## Getting Started

### Setup

1. Go to [script.google.com](https://script.google.com/) and create a new project.
2. Paste the [Code.gs](https://github.com/disha9112/Contest-Calendar-API/blob/main/Code.gs) file of this repository.
3. Create a CLIST account and generate your API key. Add your CLIST username and API key in the script.
4. Add your Google Calendar ID in the script.
5. Modify the `minDate` and `maxDate` fields to the start and end dates within which you wish to fetch contests.
6. Add a time-based trigger to fetch data periodically.

### Usage

1. Run the script.
2. Authorize permissions in the popup block.
