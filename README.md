# git-chat

This is a chat client built entirely on git. Do be aware that this is totally a joke.

I was inspired to do this by slack - the ultimate abuse of a chat program. With all its integrations, there are ways you can set it up so that all you see is a firehose of worthless data; issue tracker events, version control events - to the point that communication through your chat program becomes difficult.

This is a riff on that - what if instead of using your chat program to browse commit history, you used your commit history to chat?

# Demo

Give it a try! It's pretty simple. Just type this into your terminal:

```
git clone https://github.com/staab/git-chat.git
cd git-chat
npm start Anonymous
```

You can set your username if you'd like, by changing that first parameter to `npm start`.

# Known Issues

I'm actually pretty proud of how bad this software is.

- Sometimes it just stops receiving messages. Not sure why
- Doesn't really work cross-platform because it parses `git log` with a very naive regexp, and uses `cd`
- Sometimes it fails on startup (or after) with `can't cd to /path/to/repo`
- Authentication is done by embedding the username and password in the repo url
- Sometimes it double-commits messages because it retries on failed pushes, which re-commits
- If you delete uuid.txt it breaks everything.

# Disclaimer

This is a toy. It's not tested, it's not secure, it's not fast, it might even be dangerous. Don't use it seriously. But do try it out! Also it might only work on linux.
