<div align="center">
<a href="https://github.com/fahmirizalbudi/gitfollow" target="blank">
<img src="./logo.svg" width="300" alt="Logo" />
</a>

<br />
<br />

![](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/GitHub_API-181717?style=for-the-badge&logo=github&logoColor=white)

</div>

<br/>

## GitFollow

GitFollow is an automated real-time tool for managing your GitHub audience. Built in Node.js and TypeScript. This project uses the official GitHub REST API. Key features include:

## Features

- **Auto Follback:** Automatically follow back new users who follow you.
- **Auto Unfollow:** Automatically unfollow users who unfollowed you (reciprocity).
- **Non-Backtracker Cleanup:** Identifies and unfollows users that you follow but do not follow you back.

## Tech Stack

- **Node.js**: Asynchronous event-driven JavaScript runtime designed to build scalable network applications.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **Octokit / REST**: Official GitHub REST API client for interacting with their systems natively.

## Getting Started

To get a local copy of this project up and running, follow these steps.

### Prerequisites

- **Node.js** (v18 or higher).
- **npm** (Package Manager).
- **Personal Access Token (PAT)** from GitHub (Requires the `user:follow` scope).

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fahmirizalbudi/gitfollow.git
   cd gitfollow
   ```

2. **Install dependencies:**

   ```bash
   npm install
   cp .env.example .env
   ```

3. **Configure the Environment:**

   Open the `.env` file and insert your GitHub Token. Make sure the token has the `user:follow` scope.
   ```env
   GITHUB_TOKEN=your_token_here
   ```

4. **Build the source code:**

   ```bash
   npm run build
   ```

## Usage

### Running the Application

- **Start Automation:** `npm start`

> The script will establish a baseline on the first run, preventing it from accidentally unfollowing your legacy audience. Leave it running as it will automatically check for changes every minute.

## License

All rights reserved. This project is for personal automation testing and cannot be used or distributed without permission.
