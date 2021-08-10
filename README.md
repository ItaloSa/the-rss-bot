# the-rss-bot

A discord bot to send feed updates

## Commands

The following commands are supported:

| Command                   | Description                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `$feed-add <name> <link>` | This command adds a new feed to the current channel.                                                              |
| `$feed-list`              | This command lists all feeds in the current server with the following information: id, name, channel id and link. |
| `$feed-remove <id>`       | This command removes the feed addressed to the given id.                                                          |

## Contributing

### Instalation

1. Create a `.env` file following the example file `.env.example`

2. Install the dependencies

   ```
       $ npm install
   ```

3. Run the project
   ```
       $ npm start
   ```

### Standards

This project follows the common open source strategy.

1. Get an issue;
2. Create a branch and work on it;
3. When the job is done, create a merge request;
4. Resolve all requests of the reviewer;
5. Merge it!

Our commit naming follows the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) guide.

As convention, whe should create branches whith the following pattern:

```
<type>/issue-<number>-<branch-name-here>
```

> When it does not have a related issue, the number should be 0;

The types could be: feature, docs, fix, chore, refactor;
