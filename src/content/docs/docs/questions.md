---
title: Agent questions
description: During a turn you are watching, an Agent can ask you questions in one card, to do something only you can do, or for a secret it never sees; answer in the web chat, the terminal, the CLI or Telegram.
---

During a turn you started and are watching (a web chat, `bazilion agent chat` in a terminal, or a
Telegram message), an Agent can stop and ask you through its `ask_user` tool, in one of two ways:

- **Questions:** one or more, in one card, each with two to four choices. A question can let you
  pick several. The Agent waits up to five minutes. For each question you pick, write your own
  answer, or skip it; the first answer from any surface wins and the turn continues. Without an
  answer the Agent carries on knowing it got none.
- **Something only you can do:** a sign-in, a confirmation in your bank's app, a cable to plug in.
  The card says why and what to do, and may carry a link. It does not hold the turn: the Agent
  ends it, saying what it waits for. You answer **Done** or **Can't**, with a note if you like,
  when it suits you; that answer starts the Agent's next turn in the same conversation. A sign-in
  in the Agent's own browser needs it to show a window (`BROWSER_HEADLESS=false`) or your running
  Chrome.

The card and its outcome stay in the conversation transcript.

An answer is information only: it grants no shell or messaging permission. Do not answer a
question with credentials: an Agent asks for those with `secret_request`
([below](#secrets-an-agent-asks-for)), and Bazilion's own keys go in the configuration.

Turns nobody is watching (scheduled triggers, inbox wakes, queued web messages, piped CLI chats)
do not get `ask_user` or `secret_request`.

## Answering

- **Web:** the card appears under the chat the moment it is asked, the Agent's line in the list
  says `Waiting for you: a question` (or `needs you to do something`), and it is the first item of
  **Attention**, with the time a question stops waiting. With
  [desktop notifications](/docs/web-interface/#live-and-notifications) on, the browser shows one
  when no Bazilion tab has the focus. A card of one question answers with one click on a choice;
  in a card of several you pick for each, then **Send answers**, or **Skip all**. Your own words
  go in each question's field. An action has **Done** and **Can't** and a field for a note.
- **Terminal chat:** `bazilion agent chat` asks the card's questions one by one: a number
  (several, separated by spaces, where the question allows it), `o` for your own text or `s` to
  skip it. Blank input picks nothing. An action is printed with the command that answers it.
- **CLI, from another terminal:**

  ```sh
  bazilion question list <agent>
  bazilion question answer <agent> <question-id> --choice 2
  bazilion question answer <agent> <question-id> --text 'Use CSV'
  bazilion question answer <agent> <question-id> --answer 2 --answer 1,3 --answer 'Calm'  # one per question
  bazilion question answer <agent> <question-id> --skip
  bazilion question answer <agent> <action-id> --done --note 'Signed in'
  bazilion question answer <agent> <action-id> --cannot --note 'No access to that account'
  ```

- **Telegram:** when the Agent has a topic, each question of the card is posted there with one
  button per choice and **Skip**. A question that allows several choices has only **Skip**: reply
  to it with the numbers (`1 3`). Reply to a question's message with your own answer. The card is
  answered once every question is. An action is posted with **Done** and **Can't**.

Waiting questions and actions live only in the daemon's memory: restarting the daemon or
cancelling the turn ends a question without an answer, and an action the Agent waits on is
forgotten on a restart (it has no time limit otherwise), as is a waiting secret request.

## Secrets an Agent asks for

When an Agent needs a token or a password, `secret_request` asks for it by name (`GITHUB_TOKEN`),
with why, and optionally the hosts `web_fetch` may send it to. Like a request to do something, it
does not hold the turn; you answer when it suits you:

- **Web:** the card has a masked field with **Store**, and **Decline** with an optional note.
- **Telegram:** a message is not masked, so it says where to type the secret (a link to the chat
  when your web address is published, else the command) and has **Decline**.
- **Terminal:** `bazilion agent secret set <agent> <NAME>` reads it without echo (`--from-file` for
  a key file); `bazilion question answer <agent> <id> --decline` declines.

The Agent's next turn is told **stored** or **declined**, never the value. The hosts it asked for
are on the card and in the Telegram message; the sheet and the CLI give only the hosts you type
(`--hosts`). A reply to the Telegram message is never passed on, and is deleted when the bot may
delete messages. Its commands get the secret as an environment variable of that name, on the
host and in Docker; `web_fetch` puts it in a header written `{{secret:NAME}}` only for its hosts
and over https, and drops the Agent's headers on a redirect to another site. Tool output, and a
turn's own message such as a background job's end, reach the model with the value taken out. Each Agent's
secrets are encrypted like Bazilion's own keys, listed (never shown) on its **Secrets** sheet with
**Replace** and **Remove**, and deleted with the Agent:

```sh
bazilion agent secret list <agent>
bazilion agent secret set <agent> GITHUB_TOKEN --hosts api.github.com
bazilion agent secret rm <agent> GITHUB_TOKEN
```

This keeps the value out of the conversation; it is not a sandbox. A command can still send it
elsewhere or change it, and only the exact value is taken out of output.
