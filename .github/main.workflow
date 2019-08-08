workflow "New workflow" {
  on = "push"
  resolves = ["GitHub Action for npm"]
}

action "Hello World" {
  uses = "./action-a"
  env = {
    MY_NAME = "Mona"
  }
  args = "\"Hello world, I'm $MY_NAME!\""
}

workflow "New workflow 1" {
  on = "push"
  resolves = ["new-action"]
}

action "new-action" {
  uses = "owner/repo/path@ref"
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Hello World"]
  runs = "install"
}
