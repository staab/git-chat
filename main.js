var readline = require('readline')
var fs = require('fs')
var exec = require('child_process').exec
var rimraf = require('rimraf').sync
var path = require('path')
var uuid = require('node-uuid').v4

if (process.argv.length > 2) {
  var username = process.argv[2]
} else {
  console.log('Please provide your username as the first argument.')
  process.exit()
}

var repo = 'https://git-chat-client:git-chat1@github.com/git-chat-client/git-chat-messages.git'
var dir = process.argv.length > 3 ? process.argv[3] : path.join(process.env.HOME, '.git-chat')
var uuidFile = path.join(dir, 'uuid.txt')
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})
var cleaningUp = false

var commit = null

rimraf(dir)

exec('git clone ' + repo + ' ' + dir, function(error, stdout, stderr) {
  if (error) {
    throw new Error(error)
  }

  getCommit()

  console.log(stdout)
  console.log(stderr)

  console.log("Welcome to git-chat, the chat client built on git!")
  console.log("Type something in to join the conversation!")
  console.log("")

  push(username + " has joined")

  prompt()

  rl.on('line', function(line) {
    prompt()
    push(username + ": " + line)
  })
})

var pullInterval = setInterval(pull, 1000)

rl.on('close', cleanup)
process.on('exit', function() {
  rl.close()
})
process.on('SIGINT', function() {
  rl.close()
})

function cleanup() {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  console.log("Cleaning up...")
  cleaningUp = true

  clearInterval(pullInterval)

  push(username + " has left", function() {
    setTimeout(function () {
      rimraf(dir)
      process.exit()
    }, 1000)
  })
}

function prompt() {
  process.stdout.write(">> ")
}

function execInDir(cmd, fn, quiet) {
  exec('cd ' + dir + ' && ' + cmd, function(error, stdout) {
    if (!quiet && error) {
      console.log(error)
    }

    if (fn) {
      fn(stdout, error)
    }
  })
}

function push(line, fn) {
  fs.writeFileSync(uuidFile, uuid())

  execInDir('git add . && git commit -am "' + line + '"', function() {
    function doPush() {
      getCommit()

      execInDir('git pull && git push', function(stdout, error) {
        // Keep trying til we get it
        if (error) {
          doPush()
        } else if(fn) {
          fn()
        }
      }, true)
    }

    doPush()
  }, true)
}

function pull() {
  execInDir("git pull", function() {
    var cmd = 'git log --format=" %H :%s" ' + commit + '..HEAD'
    execInDir(cmd, function(log) {
      if (log.length > 0) {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        var sections = log.split('\n')

        if (sections.length > 0) {
          exec("( speaker-test -t sine -f 1000 )& pid=$! ; sleep 0.1s ; kill -9 $pid")
        }

        sections.forEach(function(line) {
          if (line.length > 0) {
            var msg = line.split(':').slice(1).join(":")
            console.log(msg)
          }
        })

        getCommit()
        prompt()
      }
    })
  }, true)
}

function getCommit() {
  execInDir('git rev-parse HEAD', function(stdout) {
    commit = stdout.replace('\n', '');
  })
}